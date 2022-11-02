/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// Material UI Component being used
import { 
  Box, 
  Grid, 
  Button, 
  Modal, 
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from '@mui/material';
// calendar picker from material ui imports
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

// separated component for slots
import SlotComponent from '../../components/SlotComponent/SlotComponent';

// classes for logic and functionality of parking slots
import ParkingComplexManager from '../../classes/ParkingLotClasses';

// main styles 
import './ParkingLotManagement.css';

function ParkingLotManagement() {

  // initialize the parking complex class by creating new class
  const parkingComplexManager = new ParkingComplexManager();

  // initialize states for parking slots and managing parking complex
  const [slots, setSlots] = useState([]);
  const [parkingLotManager, setParkingLotManager] = useState(() => {});
  const [entranceList, setEntranceList] = useState([]);
  const [inactiveEntrance, setInactiveEntrance] = useState([]);

  // states for parking vehicle 
  const [open, setOpen] = useState(false);
  const [vehicleSize, setVehicleSize] = useState('');
  const [entrance, setEntrance] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  // states for unparking vehicle
  const [openUnpark, setOpenUnpark] = useState(false);
  const [parkingRate, setParkingRate] = useState('');
  const [dataToUnpark, setDataToUnpark] = useState({});
  const [exitType, setExitType] = useState('');
  const [parkingData, setParkingData] = useState([]);
  
  // states for modifying the date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(false);

  // states for adding new entrance
  const [newEntrance, setNewEntrance] = useState('');
  const [newEntranceName, setNewEntranceName] = useState('');
  const [openAddEntrance, setOpenAddEntrance] = useState(false);

  // INITIALIZATION OF PARKING LOT SYSTEM
  useEffect(() => {
    // initialize a new parking floor
    const parkingLotManager = parkingComplexManager.addParkingLot()
    // set parking lot manager to be used within the system
    setParkingLotManager(parkingLotManager);
    // set initial entrance list
    setEntranceList(parkingLotManager.entrance);
    // restructure the slots array for easier mapping and display on Frontend
    parkingLotManager.spaces.map((data) => {
      return data.map((slot, _index) => (
        slot !== null && parkingLotManager.restructureSlotArray(slot)
      ))
    })
    // set all slots for parking spaces management
    if(slots.length === 0 ){
      // set the newly restructured slots
      setSlots(parkingLotManager.getAllSlots());
      // get all inactive entrances to be used later for adding new entrance
      const inactiveEntranceList = parkingLotManager.getAllSlots()
      const inactiveListEntranceFiltered = inactiveEntranceList.filter((obj) => (obj.entrance && obj.entrance_name === 'Not open yet'));
      setInactiveEntrance(inactiveListEntranceFiltered);
    };
  }, []);

  
  // HANDLERS FOR PARKING VEHICLE ---------------------------
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setVehicleSize('');
  };
  // select the vehicle size and filter the available slots based on the size
  const handleVehicleSize = (size) => {
    const parseSize = parseInt(size.target.value)
    setVehicleSize(parseSize);
  }
  // select entrance where vehicle will came from
  const handleAssignedEntrance = (event) => {
    setEntrance(event.target.value)
  }
  // provide plate number details
  const handlePlateNumber = (plateNo) => {
    setPlateNumber(plateNo.target.value)
  }
  // park vehicle function
  const parkVehicle = async () => {
    const parkObject = {
      occupied: true,
      entrance: entrance,
      plateNo: plateNumber,
    }
    await parkingLotManager.parkVehicle({parkObject, currentDate: selectedDate ? currentDate : new Date(), size: vehicleSize});
    setEntrance('');
    setPlateNumber('');
    handleClose();
  }
  // END OF HANDLERS FOR PARKING THE VEHILCE ---------------------


  // HANDLERS FOR UNPARKING THE VEHICLE FROM PARKING COMPLEX ------------------
  const handleOpenUnpark = async (data) => {
    setOpenUnpark(true);
    setDataToUnpark(data);
    const dataVal = await parkingLotManager.parkingRate({parkObject: data, currentDate: selectedDate ? currentDate : new Date()});
    setParkingData(dataVal)
    setParkingRate(dataVal.totalParkingCharge);
  };
  const handleCloseUnpark = () => {
    setOpenUnpark(false)
  }
  // select the exit type
  const handleExitType = (exitVal) => {
    const parseExit = parseInt(exitVal.target.value)
    setExitType(parseExit)
  }
  // main function for unparking vehicle, calling unparkTemporary function from parkingLotManager Class
  const unparkVehicle = async () => {
    // 2 types of unparking, temporary and release
    if(exitType === 1){
      await parkingLotManager.unparkTemporary({parkObject: dataToUnpark, currentDate: selectedDate ? currentDate : new Date()});
      handleCloseUnpark();
      setExitType('');
    } else {
      await parkingLotManager.unparkVehicle({parkObject: dataToUnpark})
      handleCloseUnpark();
      setExitType('');
    }
  }
  // END OF HANDLERS FOR UNPARKING THE VEHICLE FROM PARKING COMPLEX ---------------

  // HANDLER FOR DATE CONFIGURATION -------------------
  const handleDateAndTime = (newValue) => {
    setSelectedDate(true)
    setCurrentDate(newValue)
  }
  // END OF DATE CONFIGURATION HANDLER ----------------

  // HANDLERS FOR ADDING NEW ENTRANCE ---------------------
  const handleOpenEntranceModal = () => {
    setOpenAddEntrance(true)
  }
  const handleCloseEntranceModal = () => {
    setOpenAddEntrance(false)
  }
  const handleSelectNewEntrance = (entrance) => {
    setNewEntrance(entrance.target.value)
  }
  const handleNewEntranceName = (entranceName) => {
    setNewEntranceName(entranceName.target.value)
  }
  // main function for adding new entrance
  const addEntrance =  async () => {
    await parkingLotManager.addEntrance({newEntranceName: newEntranceName, entranceId: newEntrance})
    const newInactiveList = inactiveEntrance.filter((obj) => obj.parking_id !== newEntrance)
    setSlots(parkingLotManager.getAllSlots())
    setEntranceList(parkingLotManager.entrance)
    setInactiveEntrance(newInactiveList)
    handleCloseEntranceModal();
    setNewEntranceName('');
    setNewEntrance('');
  }
  // END OF HANDLERS FOR ADDING ENTRANCE ------------------------
 
  // MAIN SCREEN UI COMPONENTS STARTS HERE
  return (
    <div
      className='main-container container-center'
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <Grid
          item
          container
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className='map-container'
        >
          <Grid
            item
            container
            lg={8}
            md={12}
            sm={12}
            className='map-container-content container-center'
          >
            <Typography 
              variant='inherit'
              className='main-title'
            >
              OO Mall Parking Complex
            </Typography>
            <Grid
              item
              container
              lg={12}
              className='container-center'
              style={{ height: '100%', marginTop: 20 }}
            >
              {slots.map((data, index) => (
                <SlotComponent key={index} index={index} data={data} handleOpenUnpark={handleOpenUnpark} />
              ))}
            </Grid>
          </Grid>
          <Grid
            item
            container
            lg={4}
            className='config-container'
          >
            <Grid>
              <Typography 
                variant='inherit'
                className='config-title'
              >
                Parking Managment Configuration
              </Typography>
              <Typography 
                variant='inherit'
                className='config-description'
                style={{ marginTop: 25 }}
              >
                Parking Managment Configuration allows to manage the parking slots on different Floor of Object Oriented Mall Parking Complex.
                Below are the settings for you to park and unpark the vehicles in the available slots for each floor.
              </Typography>
              <Grid
                style={{
                  marginTop: 20,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography style={{ fontFamily: 'Poppins', marginBottom: 20 }}>Date Configuration</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDateTimePicker
                    renderInput={(props) => <TextField {...props}/>}
                    label={<p style={{ fontFamily: 'Poppins', marginTop: 0 }}>DateTimePicker</p>}
                    value={currentDate}
                    disablePast
                    onChange={(newValue) => handleDateAndTime(newValue)}
                  />
                </LocalizationProvider>
                <Typography sx={{ fontFamily: 'Poppins', mt: 2, mb: 2 }}>Add new vehicle to Parking Complex</Typography>
                <Button 
                  variant="contained" 
                  size="medium"
                  onClick={handleOpen}
                  disableElevation={true}
                  sx={{
                    backgroundColor: '#348feb',
                    textTransform: 'none',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    fontFamily: 'Poppins',
                    width: '50%'
                  }}
                >
                  Park Vehicle
                </Button>
                <Typography sx={{ fontFamily: 'Poppins', mt: 2, mb: 2 }}>Open new parking complex entrance</Typography>
                <Button 
                  variant="contained" 
                  size="medium"
                  onClick={handleOpenEntranceModal}
                  disableElevation={true}
                  sx={{
                    backgroundColor: '#348feb',
                    textTransform: 'none',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    fontFamily: 'Poppins',
                    width: '50%'
                  }}
                >
                  Add Entrance
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ fontFamily: 'Poppins' }}>
            Assign Parking Slot
          </Typography>
          <Typography id="modal-modal-description" sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 3 }}>
            Please add the details of the vehicle to be park.
          </Typography>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>
            Select vehicle size:
          </Typography>
          <FormControl>
            <RadioGroup
              row
              value={vehicleSize}
              onChange={handleVehicleSize}
            >
              <FormControlLabel value={1} control={<Radio />} label={<p style={{ fontFamily: 'Poppins' }}>Small</p>} />
              <FormControlLabel value={2} control={<Radio />} label={<p style={{ fontFamily: 'Poppins' }}>Medium</p>}/>
              <FormControlLabel value={3} control={<Radio />} label={<p style={{ fontFamily: 'Poppins' }}>Large</p>} />
            </RadioGroup>
            <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 1, mb: 2}}>
              Select available entrance:
            </Typography>
            <FormControl fullWidth disabled={vehicleSize !== '' ? false : true }>
              <InputLabel id="demo-simple-select-label">Select Entrance</InputLabel>
              <Select
                value={entrance}
                label="Select Entrance"
                onChange={handleAssignedEntrance}
                sx={{
                  width: 350
                }}
              >
                {entranceList.map((data, index) => (
                    <MenuItem key={data.entranceName} value={data.entranceName}>Entrance-{data.entranceName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2, mb: 2}}>
              Provide Vehicle Plate No:
            </Typography>
            <TextField id="outlined-basic" label="Vehicle Plate No." variant="outlined" value={plateNumber} onChange={handlePlateNumber}/>
          </FormControl>
          <Button 
            variant="contained" 
            size="medium"
            onClick={parkVehicle}
            disableElevation={true}
            sx={{
              backgroundColor: '#348feb',
              textTransform: 'none',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              fontFamily: 'Poppins',
              width: '100%',
              mt: 5,
            }}
          >
            Assigned Parking Slot
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openUnpark}
        onClose={handleCloseUnpark}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <FormControl>
            <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>
              Select Exit Type
            </Typography>
            <RadioGroup
              row
              value={exitType}
              onChange={handleExitType}
            >
              <FormControlLabel value={1} control={<Radio />} label={<p style={{ fontFamily: 'Poppins' }}>Temporary</p>} />
              <FormControlLabel value={2} control={<Radio />} label={<p style={{ fontFamily: 'Poppins' }}>Release</p>}/>
            </RadioGroup>
          </FormControl>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>Total Parking Fee: Php. {parkingRate}.00</Typography>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>Total Parking Hours: {parkingData && Math.round(parkingData.totalHours * 100) / 100}</Typography>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>Parking Slot Size: {parkingData && parkingData.parkingRate && parkingData.parkingRate.size}</Typography>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2}}>Parking Size Rate: Php. {parkingData && parkingData.parkingRate && parkingData.parkingRate.hourCharge} / hour</Typography>

          <Button 
            variant="contained" 
            size="medium"
            onClick={unparkVehicle}
            disableElevation={true}
            sx={{
              backgroundColor: '#348feb',
              textTransform: 'none',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              fontFamily: 'Poppins',
              width: '100%',
              mt: 10,
            }}
          >
            Unpark Vehicle
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openAddEntrance}
        onClose={handleCloseEntranceModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography sx={{ fontSize: 20, fontFamily: 'Poppins', mt: 0, mb: 2}}>
            Add New Entrance:
          </Typography>
          <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2, mb: 2}}>
            Select Entrance to open:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Inactive Entrance</InputLabel>
            <Select
              value={newEntrance}
              label="Select Inactive Entrance"
              onChange={handleSelectNewEntrance}
              sx={{
                width: 350
              }}
            >
              {inactiveEntrance.map((data, index) => (
                  <MenuItem key={data.parking_id} value={data.parking_id}>Entrance-{data.row}-{data.col}</MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontSize: 15, fontFamily: 'Poppins', mt: 2, mb: 2}}>
              Provide Entrance Name:
            </Typography>
            <TextField label="Entrance Name" variant="outlined" value={newEntranceName} onChange={handleNewEntranceName}/>
          </FormControl>
          <Button 
            variant="contained" 
            size="medium"
            onClick={addEntrance}
            disableElevation={true}
            sx={{
              backgroundColor: '#348feb',
              textTransform: 'none',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              fontFamily: 'Poppins',
              width: '100%',
              mt: 5,
            }}
          >
            Add New Entrance
          </Button>
        </Box>
      </Modal>
      </Box>
    </div>
  )
}

export default ParkingLotManagement;
