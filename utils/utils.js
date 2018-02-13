export class Utils {

  /**
   * Transforms a string array into a comma separated string list
   *
   * @param array the string array
   */
  static arrayToStringList(array) {
    if(array instanceof Array && array.length > 0) {
      let string = "";

      array.forEach(category => {
        string += category + ",";
      });

      return string.substring(0, string.length - 1);
    }

    return null;
  }

  /**
   * Transforms comma separated string list into a string array
   *
   * @param stringList the comma separated string list
   */
  static stringListToArray(stringList) {
    return stringList.split(",");
  }

}
