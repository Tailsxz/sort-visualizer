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
          <p>Swap Count: {swaps}</p>
          {totalIterations > 0 && (
            <p>Total Iteration Count: {totalIterations}</p>
          )}
          {previousSwaps > 0 && <p>Previous Swap Count: {previousSwaps}</p>}
          {previousTotalIterations > 0 && (
            <p>Previous Iteration Count: {previousTotalIterations}</p>
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
