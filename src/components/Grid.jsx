import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({
  ...props
}) => {
  return (
    <div 
      className='grid'
      {...props}
    >
    </div>
  )
}

Grid.propTypes = {}

export default Grid;