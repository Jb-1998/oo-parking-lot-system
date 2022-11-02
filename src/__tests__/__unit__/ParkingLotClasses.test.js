import ParkingComplexManager from '../../classes/ParkingLotClasses';

const parkingComplexManager = new ParkingComplexManager();
const parkingLotManager = parkingComplexManager.addParkingLot();
// initialize the map with restructured slots
parkingLotManager.spaces.map((data) => {
    return data.map((slot, _index) => (
        slot !== null && parkingLotManager.restructureSlotArray(slot)
    ))
}); 

describe('Parking Lot Complex', () => {   
    test('should initialize the map', async () => {
        const restructuredSlots = parkingLotManager.getAllSlots();
        expect(restructuredSlots.length).toBe(32)
    })
    test('should not be null value', async () => {
        const restructuredSlots = parkingLotManager.getAllSlots();
        expect(restructuredSlots[0]).not.toBeNull()
    })
    test('should have an initial entrance', async () => {
        const entrance = [
            {entranceName: 'A', row: 0, col: 2},
            {entranceName: 'B', row: 0, col: 6},
            {entranceName: 'C', row: 3, col: 3}
        ]
        expect(parkingLotManager.entrance).toMatchObject(entrance);
    })
    test('should have an empty temporary unparked list', async () => {
        expect(parkingLotManager.temporaryUnparked.length).toBe(0);
    })
})

describe('Parking Lot Complex Functionality', () => {
    let row = 0;
    let col = 0;
    let tempRow = 0;
    let tempCol = 0;
    test('should be able to park vehicle', async () => {
        const mockParkObject = {
            occupied: true,
            entrance: 'A',
            plateNo: 'NRN-3000',
        }
        const dataReturn = await parkingLotManager.parkVehicle({
            parkObject: mockParkObject, 
            currentDate: new Date(), 
            size: 1
        });
        const occupyValue = parkingLotManager.spaces[dataReturn.row][dataReturn.col]
        row = dataReturn.row;
        col = dataReturn.col;
        expect(occupyValue).toBeDefined();
        expect(occupyValue).not.toBeNull();
        expect(dataReturn.parkingSuccessful).toBe(true);
        expect(occupyValue.occupied).toBe(true)
    });
    test('should be able to unpark vehicle temporarily', async () => {
        const mockParkObject = {
            occupied: true,
            entrance: 'B',
            plateNo: 'NRN-6000',
        }
        const dataReturn = await parkingLotManager.parkVehicle({
            parkObject: mockParkObject, 
            currentDate: new Date(), 
            size: 1
        });
        tempRow = dataReturn.row
        tempCol = dataReturn.col
        const occupyValueToUnpark = parkingLotManager.spaces[dataReturn.row][dataReturn.col]
        const tempUnparkData = await parkingLotManager.unparkTemporary({
            parkObject: occupyValueToUnpark,
            currentDate: new Date(),
        })
        expect(tempUnparkData).not.toBeNull();
        expect(tempUnparkData).toBeDefined();
        expect(tempUnparkData.tempUnparkStatus).toBe(true);
        expect(tempUnparkData.updatedSpaces.vehicle_attribute.temp_parking_hours_exit).not.toBeNull();
        expect(parkingLotManager.temporaryUnparked.length).toBe(1);
    })
    test('should be able to unpark the vehicle permenantly', async () => {
        const dataToUnpark = parkingLotManager.spaces[row][col]
        const unoccupiedData = await parkingLotManager.unparkVehicle({
            parkObject: dataToUnpark,
        })
        expect(unoccupiedData).toBeDefined();
        expect(unoccupiedData).not.toBeNull();
        expect(unoccupiedData.successfulUnpark).toBe(true);
        expect(unoccupiedData.updatedObject.occupied).toBe(false);
    }); 
    test('should be able to add new entrance', async () => {
        const inactiveListEntranceFiltered = parkingLotManager
        .getAllSlots()
        .filter((obj) => (obj.entrance && obj.entrance_name === 'Not open yet'));
        const newEntranceData = await parkingLotManager.addEntrance({
            newEntranceName: 'D',
            entranceId: inactiveListEntranceFiltered[3].parking_id,
            slotsList: parkingLotManager.getAllSlots()
        })
        expect(newEntranceData).not.toBeNull();
        expect(newEntranceData).toBeDefined();
        expect(newEntranceData.addSuccessful).toBe(true);
        expect(newEntranceData.assignedSlot.open).toBe(true);
    });
    test('should be able to compute parking hour rate', async () => {
        const spaceToComputeRate = await parkingLotManager.spaces[tempRow][tempCol];
        const parkingRateData = await parkingLotManager.parkingRate({
            parkObject: spaceToComputeRate,
            currentDate: new Date(),
        })
        expect(parkingRateData).not.toBeNull();
        expect(parkingRateData).toBeDefined();
        expect(parkingRateData.computeSuccessful).toBe(true);
        expect(parkingRateData.totalParkingCharge).toEqual(40);
    })
})