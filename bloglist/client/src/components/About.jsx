import * as React from 'react';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import {Link} from 'react-router-dom'


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
        What is this?
      </Typography>

      <Typography variant="body2">
        The Bloglist application is built with Node.js and React.

      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" component={Link} to="/how-to-use">Learn More</Button>
    </CardActions>
  </React.Fragment>
)

export default function About() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  )
}