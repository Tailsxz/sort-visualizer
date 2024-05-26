import PropTypes from 'prop-types'

const Grid = ({
  swaps,
  previousSwaps,
  children,
  ...props
}) => {
  return (
    <div 
      className='grid'
      {...props}
    >
      <div className="swaps">
        <span>Swap Count: {swaps}</span>
        {previousSwaps > 0 && <span>Previous Swap Count: {previousSwaps}</span>}
      </div>
      {children}
    </div>
  )
}

Grid.propTypes = {
  swaps: PropTypes.number.isRequired,
  previousSwaps: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
}

export default Grid;