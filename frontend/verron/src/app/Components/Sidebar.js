import { CiSearch, CiShoppingCart } from "react-icons/ci";
import styles from './Sidebar.module.css';

const Sidebar = ({ onSearchClick }) => {
  return (
    <div className={`${styles.sidebar} z-40`}>
      <div className={styles.icon} onClick={onSearchClick}>
        <CiSearch size={30} />
      </div>
      <div className={styles.icon}>
        <CiShoppingCart size={30} />
      </div>
    </div>
  );
};

export default Sidebar;