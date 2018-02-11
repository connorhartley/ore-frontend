import Vue from "vue"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"

import fontawesome from '@fortawesome/fontawesome'
import faChevronDown from "@fortawesome/fontawesome-free-solid/faChevronDown"
import faHome from "@fortawesome/fontawesome-free-solid/faHome"
import faDiscourse from "@fortawesome/fontawesome-free-brands/faDiscourse"
import faCode from "@fortawesome/fontawesome-free-solid/faCode"
import faBook from "@fortawesome/fontawesome-free-solid/faBook"
import faGraduationCap from "@fortawesome/fontawesome-free-solid/faGraduationCap"
import faPlug from "@fortawesome/fontawesome-free-solid/faPlug"
import faDownload from "@fortawesome/fontawesome-free-solid/faDownload"
import faComments from "@fortawesome/fontawesome-free-solid/faComments"
import faBars from "@fortawesome/fontawesome-free-solid/faBars"
import faEye from "@fortawesome/fontawesome-free-solid/faEye"
import faStar from "@fortawesome/fontawesome-free-solid/faStar"
import faServer from "@fortawesome/fontawesome-free-solid/faServer"
import faComment from "@fortawesome/fontawesome-free-solid/faComment"
import faWrench from "@fortawesome/fontawesome-free-solid/faWrench"
import faMoneyBillAlt from "@fortawesome/fontawesome-free-solid/faMoneyBillAlt"
import faPuzzlePiece from "@fortawesome/fontawesome-free-solid/faPuzzlePiece"
import faGamepad from "@fortawesome/fontawesome-free-solid/faGamepad"
import faLock from "@fortawesome/fontawesome-free-solid/faLock"
import faMagic from "@fortawesome/fontawesome-free-solid/faMagic"
import faGlobe from "@fortawesome/fontawesome-free-solid/faGlobe"
import faAsterisk from "@fortawesome/fontawesome-free-solid/faAsterisk"

fontawesome.config = {
  autoAddCss: false,
};

fontawesome.library.add(faChevronDown, faHome, faDiscourse, faCode, faBook, faGraduationCap, faPlug, faDownload,
  faComments, faBars, faEye, faStar, faServer, faComment, faWrench, faPuzzlePiece, faGamepad, faMoneyBillAlt, faLock, faMagic, faGlobe, faAsterisk);

Vue.component("fa-icon", FontAwesomeIcon);
