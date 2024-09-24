import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Bar = ({ number, className = "", ...props }) => {
  return (
    <motion.div className={`bar ${className}`} layout {...props}>
      <motion.div layout className="number">
        {number}
      </motion.div>
    </motion.div>
  );
};

Bar.propTypes = {
  number: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Bar;
