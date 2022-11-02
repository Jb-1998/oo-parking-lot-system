import React from 'react';
import { Grid } from '@mui/material';
function SlotComponent({index, data, handleOpenUnpark}){

  const spacesColor = (data) => {
    if (data.open === true) return '#14ff3b'
    if (data.vehicle_attribute && data.vehicle_attribute.vehicle_temp_status === true) return '#eba134'
    if (data.occupied && data.vehicle_attribute && data.vehicle_attribute.vehicle_temp_status === false) return '#348feb'
    if (data.entrance === true && data.open === false) return '#9e9e9e'
    return ''
  }
  return (
    <Grid
      item
      xs={1.2}
      key={index}
      style={{
      height: 100,
      borderWidth: 1,
      borderStyle: 'solid',
      margin: 10,
      padding:30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: spacesColor(data),
      }}
      className='slot-style'
      onClick={data.occupied ? () => handleOpenUnpark(data) : () => {}}
    >
    <p style={{ fontSize: 12, textAlign: 'center' }}>
      {data.row}-{data.col}-{data.parking_size}
      <br/>{data.entrance ? `Entrance-${data.entrance_name}` : (data.occupied ? 'Occupied' : 'Not Occupied')}
    </p>
  </Grid>
  )
}

export default SlotComponent;