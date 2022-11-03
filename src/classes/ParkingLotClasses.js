
import moment from 'moment/moment';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId({length: 10})

// Spot class, allows to create new spot object
// this can an alternative to factory function, where it returns an object
class SpotObject {
  constructor({size, row, col} = {}){
    this.parking_id = uid()
    this.parking_size = size
    this.entrance_name = null
    this.occupied = false
    this.entrance = false
    this.row = row
    this.col = col
    this.vehicle_attribute = {
      vehicle_size: null,
      vehicle_plate_no: null,
      parking_hours: null,
      parking_rates: null,
      vehicle_temp_status: false,
      parking_hours_start: null,
      parking_hours_release: null,
      temp_parking_hours_exit: null,
      temp_parking_hours_enter: null,
    }
    this.open = false
  }
}

// Entrance Class, a seperate class object for entrance only, 
// clearly, this class didn't extend the Spot object as it has same property being used, but have different values
// Created this just to have a separation of concern from Spot object where i can modify seperately
class Entrance {
  constructor({ row, col, entranceName, open}){
    this.parking_id = uid()
    this.parking_size = 0
    this.entrance_name = entranceName
    this.occupied = false
    this.entrance = true
    this.row = row
    this.col = col
    this.vehicle_attribute = null
    this.open = open
  }
}
// class for managing the parking lot.
class ParkingLotManager {
  constructor(){
    this.max_col = 8
    this.max_rows = 4
    this.new_row = -1;
    this.new_col = -1;
    this.restructedSlotsArray = [];
    // initializing the parking spaces
    this.spaces = new Array(this.max_rows).fill(null).map( () => new Array(this.max_col).fill(null));
    this.entrance = [
      {entranceName: 'A', row: 0, col: 2},
      {entranceName: 'B', row: 0, col: 6},
      {entranceName: 'C', row: this.max_rows - 1, col: 3}
    ]
    this.temporaryUnparked = []
    // initialize the parking space map
    this.initializeParkingSpaces()
  }

  // instantiate parking lot slots / spaces - Responsibility #1
  initializeParkingSpaces() {
    for ( let i=0; i<this.max_rows; i++ ) {
      for ( let j=0; j<this.max_col; j++ ) {
        if ( !this.isEntryPoint(i,j) ) {
          this.spaces[i][j] = new SpotObject({size: this.getRandomSize().value, row: i, col: j})
        }
      }
    }
  }
  // helper function instantiate and identify parking lot entrances for responsibility #1
  isEntryPoint ( row, col ) {
    if ( col === 0 || row === 0 || row === this.max_rows - 1 || col === this.max_col - 1 ) {
      const findEntrances = this.entrance.find((obj) => obj.row === row && obj.col === col)
      if(findEntrances){
        this.spaces[row][col] = new Entrance({row: findEntrances.row, col: findEntrances.col, entranceName: findEntrances.entranceName, open: true})
      } else {
        this.spaces[row][col] = new Entrance({row: row, col: col, entranceName: 'Not open yet', open: false})
      }
      return true
    } else {
      return false;
    }
  }
  // restructured the space array
  restructureSlotArray(slot){
    this.restructedSlotsArray.push(slot);
  }
  // get all restructued slots
  getAllSlots() {
    return this.restructedSlotsArray;
  }

  // helper for instantiating the parking size for each slots randomly for responsibility #1
  getRandomSize() {
    // SP = 1, MP = 2, LP = 3
    const max = 3
    const min = 1
    const descriptors = ['SP', 'MP', 'LP']
    const size = Math.round(Math.random() * (max - min) + min)
    const desc = descriptors[size]
    return  {
      value: size,
      desc: desc
    }
  }
  // get list parking lot spaces and entrances - Responsibility #2
  getSpaces() {
    return this.spaces;
  }

  // add new entrance function - Responsibility #3
  async addEntrance({newEntranceName, entranceId}) {
    const findEntranceSlot = this.restructedSlotsArray.find((obj) => obj.parking_id === entranceId);
    const entranceObject = this.spaces[findEntranceSlot.row][findEntranceSlot.col]
    if (entranceObject) {
      if (this.entrance.find((obj) => obj.entranceName === newEntranceName)) {
        const objectToReturn = {
          addSuccessful: false,
          errorMessage: 'Existing Entrance Name. Please change the entrance name.'
        }
        return objectToReturn;
      }
      else {
        const SpotObject = {
          ...entranceObject,
          entrance_name: newEntranceName,
          open: true,
        }
        Object.assign(this.spaces[entranceObject.row][entranceObject.col], SpotObject);
        const objIndex = this.restructedSlotsArray.findIndex((obj) => obj.parking_id === entranceId);
        this.restructedSlotsArray[objIndex].entrance_name = newEntranceName
        this.restructedSlotsArray[objIndex].open = true
        this.entrance.push({
          entranceName: newEntranceName,
          row: entranceObject.row,
          col: entranceObject.col
        })
        const returnObject = {
          updatedSpaces: this.spaces,
          assignedSlot: this.spaces[entranceObject.row][entranceObject.col],
          addSuccessful: true,
        }
        return returnObject;
      }
    }
  }
  // helper function for parking vehicle - Responsibility #4
  updateSpotObject(findTempUnparked, currentDate, totalExitHours){
    const vehicle_attribute = findTempUnparked.vehicle_attribute
    const SpotObject = {
      ...findTempUnparked,
      vehicle_attribute: {
        ...vehicle_attribute,
        vehicle_temp_status: false,
        parking_rates: vehicle_attribute.parking_rates + (totalExitHours ? 40 : 0),
        parking_hours_start: currentDate ? currentDate : new Date(),
      }
    }
    this.temporaryUnparked = this.temporaryUnparked.filter((obj) => obj.vehicle_attribute.vehicle_plate_no !== findTempUnparked.vehicle_attribute.vehicle_plate_no);
    Object.assign(this.spaces[findTempUnparked.row][findTempUnparked.col], SpotObject)
    const returnObject = {
      updatedSpaces: this.spaces,
      assignedSlot: this.spaces[findTempUnparked.row][findTempUnparked.col],
      parkingSuccessful: true
    }
    return returnObject;
  }
  // helper function for parking vehicle - Responsibility #4
  async findNearestParkingSpace({size, entrance, distance}) {
    // Search for the nearest parking space
    for ( let i=0; i < this.max_rows; i++ ) {
      for ( let j=0; j < this.max_col; j++ ) {
        if ( !this.isEntryPoint(i,j) ) {
          let p = this.spaces[i][j]
          // Check if vehicle fits in parking slot
          let computedDistance = Math.abs( entrance.row - p.row ) + Math.abs( entrance.col - p.col )
          if ( (size <= p.parking_size) && (distance > computedDistance) && !p.occupied ) {
            this.new_row = i
            this.new_col = j
            distance = computedDistance;
          }          
        }
      }
    }
  }
  // park the vehicle to the nearest slot in the entrance and update the spaces - Responsibility #4
  async parkVehicle({parkObject, currentDate, size}){
    const entrance = this.entrance.find(gate => gate.entranceName === parkObject.entrance);
    const findSamePlateNo = this.restructedSlotsArray.find((obj) => 
      obj.vehicle_attribute?.vehicle_plate_no === parkObject.plateNo
    )
    let distance = 9999;

    if (this.temporaryUnparked.length > 0) {
      const findTempUnparked = this.temporaryUnparked.find((obj) =>
       obj.vehicle_attribute.vehicle_plate_no === parkObject.plateNo
      );    
      // compute the time of temp exit and the current time if it exceeds one hour
      // if time exceeds to one hour, adjust the flat rate and double the amount
      const tempExitHours = moment(findTempUnparked.vehicle_attribute.temp_parking_hours_exit, 'YYYY-MM-DD HH:mm:ss');
      const currentTimeAndDate = moment(currentDate ? currentDate : new Date(), 'YYYY-MM-DD HH:mm:ss');
      const totalExitHours = moment.duration(currentTimeAndDate.diff(tempExitHours)).asHours()
      // if total exit hours exceeds 1 hour update the spot object with new parking rate, else parking rate defaults to 0
      if (totalExitHours > 1) {
        return this.updateSpotObject(findTempUnparked, currentDate, totalExitHours)
      } else {
        return this.updateSpotObject(findTempUnparked, currentDate, null)
      }
    }  else if (findSamePlateNo && findSamePlateNo.vehicle_attribute.vehicle_temp_status === false) {
        const returnObject = {
          parkingSuccessful: false,
          errorMessage: 'Duplicate Plate No'
        }
        return returnObject;
    } else {
      // find the nearest parking space based on it's size
      await this.findNearestParkingSpace({size, entrance, distance})
      if ( this.new_row === -1 ) {
        return false
      } else {
        const previousObjectContent = this.spaces[this.new_row][this.new_col];
        const vehicle_attribute = previousObjectContent.vehicle_attribute;
        const SpotObject = {
          ...previousObjectContent,
          parking_id: previousObjectContent.parking_id,
          parking_size: previousObjectContent.parking_size,
          occupied: true,
          vehicle_attribute: {
            ...vehicle_attribute,
            vehicle_size: size,
            vehicle_plate_no: parkObject.plateNo,
            parking_hours: 1,
            parking_rates: 40,
            parking_hours_start: currentDate ? currentDate : new Date(),
          },
        }
        Object.assign(this.spaces[this.new_row][this.new_col], SpotObject)
        const returnObject = {
          row: this.new_row,
          col: this.new_col,
          updatedSpot: this.spaces[this.new_row][this.new_col],
          parkingSuccessful: true,
        }
        return returnObject;
      }
    }
  }
  // unpark the vehicle, removing from the slots and updating the spaces - Responsibility #5
  async unparkVehicle({parkObject}){
    const SpotObject = {
      ...parkObject,
      occupied: false,
      vehicle_attribute: {
        vehicle_size: null,
        vehicle_plate_no: null,
        parking_hours: null,
        parking_rates: null,
        vehicle_temp_status: false,
        parking_hours_start: null,
        parking_hours_release: null,
        temp_parking_hours_exit: null,
        temp_parking_hours_enter: null,
      },
    }
    Object.assign(this.spaces[parkObject.row][parkObject.col], SpotObject);
    this.temporaryUnparked = this.temporaryUnparked.filter((obj) => obj.vehicle_attribute.vehicle_plate_no === parkObject.vehicle_attribute.vehicle_plate_no);
    const objectToReturn = {
      updatedObject: this.spaces[parkObject.row][parkObject.col],
      successfulUnpark: true
    }
    return objectToReturn;
  }
  // unpark the vehicle temporary, vehicle will return and occupy the same parking space - Responsibility #5
  async unparkTemporary({parkObject, currentDate}) {
    const SpotObject = {
      ...parkObject,
      vehicle_attribute: {
        ...parkObject.vehicle_attribute,
        vehicle_temp_status: true,
        temp_parking_hours_exit: currentDate ? currentDate : new Date(),
      }
    }
    this.temporaryUnparked.push(SpotObject);
    Object.assign(this.spaces[parkObject.row][parkObject.col], SpotObject)
    const objectToReturn = {
      tempUnparkStatus: true,
      updatedSpaces: this.spaces[parkObject.row][parkObject.col]
    }
    return objectToReturn;
  }
  // compute the parking rate - Responsibility #6
  async parkingRate({parkObject, currentDate}){
    // initialize the parking flat rate 
    const flatRate = parkObject.vehicle_attribute.parking_rates;
    // get the time start and time end
    const parking_start = moment(parkObject.vehicle_attribute.parking_hours_start, 'YYYY-MM-DD HH:mm:ss');
    const currentTimeAndDate = moment(currentDate ? currentDate : new Date(), 'YYYY-MM-DD HH:mm:ss');
    const hours =  moment.duration(currentTimeAndDate.diff(parking_start)).asHours();
    if (hours < 0) {
      return {
        computeSuccessful: false,
        errorMessage: 'You have inputted a negative hours'
      }
    }
    let remainingTime = hours
    let totalParkingCharge = 0;

    // get the flat rate of parked vehicle
    let hourFlatRate = 0;
    // make an object of flat rate for each parking size, for easier extension of new type of charge
    const parkingFlatRates = [
      { size: 1, hourCharge: 20 },
      { size: 2, hourCharge: 60 },
      { size: 3, hourCharge: 100 },
    ]
    const findParkingRates = parkingFlatRates.find((obj) => obj.size === parkObject.parking_size)
    if(findParkingRates){
      hourFlatRate = findParkingRates.hourCharge
    }
    // get the initial rate 
    if(remainingTime <= 3 ){
      totalParkingCharge += flatRate
    }
    // get the rate if the parking hour exceeds 3 hours flat rate
    if (Math.ceil(remainingTime) > 3 && Math.ceil(remainingTime) < 24) {
      let additionalCharge = (Math.ceil(remainingTime) - 3) * hourFlatRate;
      totalParkingCharge += additionalCharge + flatRate;
      remainingTime -= Math.ceil(remainingTime) 
    }
    // get the parking rate for vehicle that exceeds 24 hours regardless of parking slot size
    if (hours > 24){
      let totalDays = parseInt(hours / 24);
      let hoursToDays = hours / 24
      totalParkingCharge += totalDays * 5000
      // get the remaining time 
      let remainingDays = hoursToDays - totalDays
      remainingTime = remainingDays * 24
      while(Math.ceil(remainingTime) > 0){
        let additionalCharge = Math.ceil(remainingTime) * hourFlatRate;
        totalParkingCharge += additionalCharge;
        remainingTime -= Math.ceil(remainingTime) 
      }
    }
    const objectToReturn = {
      remainingTime: remainingTime,
      totalParkingCharge: totalParkingCharge,
      totalHours: hours,
      parkingRate: findParkingRates,
      computeSuccessful: true,
    }
    return objectToReturn;
  }
}

// MAIN MANAGER FOR MANAGING PARKING COMPLEX ,
// will allow to add function such as creating a parking complex in a building form
// extending function to add features such as add parking floors or creating factory function based on the class provided
class ParkingComplexManager {
  constructor(){
    this.restructedSlotsArray = []
  }
  addParkingLot() {
    return new ParkingLotManager()
  }
}

export default ParkingComplexManager;