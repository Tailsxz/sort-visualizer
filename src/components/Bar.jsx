import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Bar = ({ number, ...props }) => {
  return (
    <motion.div className="bar" layout {...props}>
      <motion.div layout className="number">
        {number}
      </motion.div>
    </motion.div>
  );
};

Bar.propTypes = {
  number: PropTypes.number.isRequired,
};

export default Bar;
