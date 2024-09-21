import PropTypes from "prop-types";

const Grid = ({
  swaps,
  previousSwaps,
  totalIterations,
  previousTotalIterations,
  children,
  ...props
}) => {
  return (
    <div className="grid" {...props}>
      <div className="swaps">
        <span>Swap Count: {swaps}</span>
        {previousSwaps > 0 && <span>Previous Swap Count: {previousSwaps}</span>}
        {totalIterations > 0 && (
          <span>Total Iteration Count: {totalIterations}</span>
        )}
        {previousTotalIterations > 0 && (
          <span>Previous Iteration Count: {previousTotalIterations}</span>
        )}
      </div>
      {children}
    </div>
  );
};

Grid.propTypes = {
  swaps: PropTypes.number.isRequired,
  previousSwaps: PropTypes.number.isRequired,
  totalIterations: PropTypes.number.isRequired,
  previousTotalIterations: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Grid;
