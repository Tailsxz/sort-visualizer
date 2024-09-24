import { forwardRef } from "react";
import PropTypes from "prop-types";

const Grid = forwardRef(
  (
    {
      swaps,
      previousSwaps,
      totalIterations,
      previousTotalIterations,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="grid" ref={ref} {...props}>
        <div className="swaps">
          <span>Swap Count: {swaps}</span>
          {totalIterations > 0 && (
            <span>Total Iteration Count: {totalIterations}</span>
          )}
          {previousSwaps > 0 && (
            <span>Previous Swap Count: {previousSwaps}</span>
          )}
          {previousTotalIterations > 0 && (
            <span>Previous Iteration Count: {previousTotalIterations}</span>
          )}
        </div>
        {children}
      </div>
    );
  },
);

Grid.propTypes = {
  swaps: PropTypes.number.isRequired,
  previousSwaps: PropTypes.number.isRequired,
  totalIterations: PropTypes.number.isRequired,
  previousTotalIterations: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

Grid.displayName = "Grid";

export default Grid;
