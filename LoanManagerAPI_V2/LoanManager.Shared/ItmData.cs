using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LoanManager.Shared
{
    [CLSCompliant(false)]
    public class ItmData
    {
        #region Get Data from Data Object
        /// <summary>
        /// Get australian timezone by state
        /// </summary>
        /// <param name="state"></param>
        /// <returns></returns>
        public static string GetAustralianTimezone(string state)
        {
            state = state.ToLower().Trim();
            if (state == "wa" || state.Contains("western")) return "W. Australia Standard Time";
            else if (state == "sa" || state.Contains("south")) return "Cen. Australia Standard Time";
            else if (state == "nt" || state.Contains("northern")) return "AUS Central Standard Time";
            else if (state == "qld" || state.Contains("queensland")) return "E. Australia Standard Time";
            else if (state == "tas" || state.Contains("tasmanina")) return "Tasmania Standard Time";
            else return "AUS Eastern Standard Time";
        }

        /// <summary>
        /// GetSystemTimeZones
        /// </summary>
        /// <param name="defaultSelectedIndex"></param>
        /// <returns></returns>
        public static DataTable GetSystemTimeZones(ref int defaultSelectedIndex)
        {
            //todo:Hasan
            //var query = from t in TimeZoneInfo.GetSystemTimeZones()
            //            select new
            //            {
            //                t.Id,
            //                t.DisplayName
            //            };

            //DataTable dt = new DataTable();
            //dt = ItmData.GetDataTableFromIEnumerable(query);
            //var row = dt.Select(string.Format("Id = '{0}'", Itm.Utils.Environments.BusinessProfileTimeZoneID)).FirstOrDefault();
            //if (row != null)
            //{
            //    defaultSelectedIndex = dt.Rows.IndexOf(row);
            //}
            //return dt;
            return null;
        }
        /// <summary>
        /// Get australian time diff between zones in minutes with local time
        /// </summary>
        /// <param name="state"></param>
        /// <returns></returns>
        public static double GetAustralianTimeDiffMinutesWithLocalTime(string state)
        {
            var stateTimeZone = TimeZoneInfo.FindSystemTimeZoneById
            (GetAustralianTimezone(state));
            var localTimeZone = TimeZoneInfo.Local;
            var now = DateTimeOffset.UtcNow;
            return (localTimeZone.GetUtcOffset(now) - stateTimeZone.GetUtcOffset(now)).TotalMinutes;
        }
        /// <summary>
        /// GetGuid
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Guid GetGuid(object value)
        {
            if (value == null) return Guid.Empty;
            else if (value == DBNull.Value) return Guid.Empty;
            Guid retValue = Guid.Empty;
            Guid.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int GetInteger(object value)
        {
            if (value == null) return 0;
            else if (value == DBNull.Value) return 0;
            if (value.GetType() == typeof(bool) || value.GetType() == typeof(Nullable<bool>))
            {
                return Convert.ToInt32(value);
            }
            int retValue = 0;
            int.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static decimal GetDecimal(object value)
        {
            if (value == null) return 0;
            else if (value == DBNull.Value) return 0;
            decimal retValue = 0;
            value = value.ToString().Replace("$", "").Replace("%", "").Replace(",", "");
            decimal.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static double GetDouble(object value)
        {
            if (value == null) return 0;
            else if (value == DBNull.Value) return 0;
            double retValue = 0;
            value = value.ToString().Replace("$", "").Replace("%", "").Replace(",", "");
            double.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        public static long GetLong(object value)
        {
            if (value == null) return 0;
            else if (value == DBNull.Value) return 0;
            long retValue = 0;
            long.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool GetBoolean(object value)
        {
            if (value == null) return false;
            else if (value == DBNull.Value) return false;
            bool retValue = false;
            bool.TryParse(value.ToString(), out retValue);
            return retValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime GetDateTime(object value)
        {
            if (value == null) return DateTime.MinValue;
            else if (value == DBNull.Value) return DateTime.MinValue;
            DateTime retValue = DateTime.MinValue;
            if (DateTime.TryParse(value.ToString(), out retValue))
            {
                return retValue;
            }
            else return DateTime.MinValue;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string GetString(object value)
        {
            if (value == null) return null;
            else if (value == DBNull.Value) return null;
            return value.ToString();
        }
        /// <summary>
        /// GetSQLParameterValue
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static object GetSQLParameterValue(string str)
        {
            if (str == null) return DBNull.Value;
            else return str;
        }
        /// <summary>
        /// Split a camel case string
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string SplitCamelCase(string value)
        {
            if (String.IsNullOrEmpty(value)) return value;
            var r = new Regex(@"
                (?<=[A-Z])(?=[A-Z][a-z]) |
                 (?<=[^A-Z])(?=[A-Z]) |
                 (?<=[A-Za-z])(?=[^A-Za-z])", RegexOptions.IgnorePatternWhitespace);
            return r.Replace(value, " ");
        }
        /// <summary>
        /// Get Start of the month
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static DateTime GetStartOfTheMonth(DateTime date)
        {
            DateTime dt = DateTime.MinValue;
            DateTime.TryParse(date.Year + "-" + date.Month + "-01", out dt);
            return dt;
        }
        /// <summary>
        /// Get End of the Month
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static DateTime GetEndOfTheMonth(DateTime date)
        {
            DateTime dt = DateTime.MinValue;
            if (DateTime.TryParse(date.Year + "-" + date.Month + "-01", out dt))
            {
                dt = dt.AddMonths(1).AddDays(-1);
            }
            return dt;
        }
        #endregion

        #region Check if data type is valid
        /// <summary>
        /// Validate an integer value
        /// </summary>
        /// <param name="value">Integer value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidInteger(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                int retValue = 0;
                if (int.TryParse(value.ToString(), out retValue)) return true;
                else return false;
            }
        }
        /// <summary>
        /// Validate a Guid value
        /// </summary>
        /// <param name="value">Guid value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidGuid(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                Guid retValue = Guid.Empty;
                if (Guid.TryParse(value.ToString(), out retValue)) return true;
                else return false;
            }
        }
        /// <summary>
        /// Validate a decimal value
        /// </summary>
        /// <param name="value">Decimal value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidDecimal(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                decimal retValue = 0;
                value = value.ToString().Replace("$", "").Replace("%", "").Replace(",", "");
                if (decimal.TryParse(value.ToString(), out retValue)) return true;
                else return false;
            }
        }
        /// <summary>
        /// Validate a double value
        /// </summary>
        /// <param name="value">Double value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidDouble(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                double retValue = 0;
                value = value.ToString().Replace("$", "").Replace("%", "").Replace(",", "");
                if (double.TryParse(value.ToString(), out retValue)) return true;
                else return false;
            }
        }
        /// <summary>
        /// Validate a DateTime value
        /// </summary>
        /// <param name="value">DateTime value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidDateTime(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                DateTime retValue = DateTime.MinValue;
                if (DateTime.TryParse(value.ToString(), out retValue))
                {
                    if (retValue == DateTime.MinValue) return false;
                    else return true;
                }
                else return false;
            }
        }
        /// <summary>
        /// Validate a NULL DateTime value
        /// </summary>
        /// <param name="dt">DateTime value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsNullDateTime(DateTime dt)
        {
            bool bResult = false;
            try
            {
                DateTime nullDateTime = DateTime.Parse("1/01/0001 12:00:00 AM");
                bResult = (dt.CompareTo(nullDateTime) == 0);
            }
            catch { bResult = false; }
            return bResult;
        }
        /// <summary>
        /// Validate an SQL DateTime value
        /// </summary>
        /// <param name="dt">SQL DateTime value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidSQLDateTime(DateTime dt)
        {
            bool bResult = false;
            try
            {
                DateTime sqlMinDateTime = DateTime.Parse("1/1/1753 12:00:00 AM");
                bResult = (dt > sqlMinDateTime);
            }
            catch { bResult = false; }
            return bResult;
        }
        /// <summary>
        /// Validate a boolean value
        /// </summary>
        /// <param name="value">Boolean value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidBoolean(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else
            {
                bool retValue = false;
                if (bool.TryParse(value.ToString(), out retValue)) return true;
                else return false;
            }
        }
        /// <summary>
        /// Validate a string value
        /// </summary>
        /// <param name="value">String value we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidString(object value)
        {
            if (value == null || value == DBNull.Value) return false;
            else return true;
        }
        /// <summary>
        /// method for validating an eail with regular expressions
        /// </summary>
        /// <param name="value">Eamil id we're validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidEmail(object value)
        {
            if (IsValidString(value))
            {
                string strRegex = @"\w+([-+.']\w+)*.?@\w+([-.]\w+)*\.\w+([-.]\w+)*";
                Regex regex = new Regex(strRegex);
                if (regex.IsMatch(value.ToString()))
                    return (true);
                else
                    return (false);
            }
            else return false;
        }
        /// <summary>
        /// method for validating a url with regular expressions
        /// </summary>
        /// <param name="value">url we're validating</param>
        /// <returns>true if valid, otherwise false</returns>
        public static bool IsValidUrl(object value)
        {
            if (IsValidString(value))
            {
                string pattern = @"^(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*[^\.\,\)\(\s]$";
                Regex reg = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
                return reg.IsMatch(value.ToString());
            }
            else return false;
        }
        /// <summary>
        /// Validate a mobile number
        /// </summary>
        /// <param name="value">Mobile number we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidMobileNumber(object value)
        {
            //throw new NotImplementedException();
            return true;
        }
        /// <summary>
        /// Validate a phone number
        /// </summary>
        /// <param name="value">Phone number we are validating</param>
        /// <returns>Validation Result</returns>
        public static bool IsValidPhoneNumber(object value)
        {
            return true;
        }
        #endregion

        #region Convert
        /// <summary>
        /// Convert from Decimal to Hour
        /// </summary>
        /// <param name="value">Value to Convert</param>
        /// <returns>Converted Value</returns>
        public static string ConvertFromDecimalToHour(object value)
        {
            if (value == null || value == DBNull.Value) return string.Empty;
            else
            {
                string hours = string.Empty;
                string[] str = GetDouble(value).ToString("F2").Split('.');
                if (str.Length == 1)
                {
                    hours = str[0] + ":00";
                }
                else
                {
                    hours = GetDouble(str[0] + "." + ((GetInteger(str[1]) * 60.0) / 100).ToString("00")).ToString("F2").Replace(".", ":");
                }

                return hours;
            }
        }
        /// <summary>
        /// Convert from Hour to Decimal
        /// </summary>
        /// <param name="value">Value to Convert</param>
        /// <returns>Converted Value</returns>
        public static decimal ConvertFromHourToDecimal(object value)
        {
            if (value == null || value == DBNull.Value) return 0;
            else
            {
                decimal hours = 0;
                string[] str = GetDecimal(value.ToString().Replace(":", ".")).ToString("0.00").Split('.');
                if (str.Length == 1)
                {
                    hours = GetDecimal(str[0] + ".00");
                }
                else
                {
                    hours = GetDecimal(str[0] + "." + (((GetDouble(str[1]) * 100) / 60) + .49).ToString("00"));
                }

                return hours;
            }
        }
        //todo:Hasan
        ///// <summary>
        ///// Convert Data Table from IEnumerable
        ///// </summary>
        ///// <param name="ien">query</param>
        ///// <param name="setNullForEmptyColumns">returns null if no columns found</param>
        ///// <returns></returns>
        //public static DataTable ConvertToDatatable(IEnumerable ien, bool setNullForEmptyColumns)
        //{
        //    return GetDataTableFromIEnumerable(ien, setNullForEmptyColumns);
        //}
        ///// <summary>
        ///// Convert IEnumerable to datatable
        ///// </summary>
        ///// <param name="ien"> IEnumerable </param>
        ///// <returns> Datatable </returns>
        //public static DataTable ConvertToDatatable(IEnumerable ien)
        //{
        //    return GetDataTableFromIEnumerable(ien);
        //}
        public static DataTable GetDatatableFromDictionary(Dictionary<int, string> dictionary, bool addEmptyRow, bool sortByName, string valueColName = "Id", string labelColName = "Name")
        {
            if (dictionary == null) return null;
            var dt = new DataTable();
            dt.Columns.Add(valueColName, typeof(int));
            dt.Columns.Add(labelColName, typeof(string));
            if (addEmptyRow)
            {
                var row = dt.NewRow();
                row[0] = 0;
                row[1] = string.Empty;
                dt.Rows.Add(row);
            }
            if (sortByName)
            {
                foreach (var item in dictionary.OrderBy(t => t.Value))
                {
                    var row = dt.NewRow();
                    row[0] = item.Key;
                    row[1] = item.Value;
                    dt.Rows.Add(row);
                }
            }
            else
            {
                foreach (var item in dictionary)
                {
                    var row = dt.NewRow();
                    row[0] = item.Key;
                    row[1] = item.Value;
                    dt.Rows.Add(row);
                }
            }
            return dt;
        }
        /// <summary>
        /// get data table from enum list
        /// </summary>
        /// <param name="enumType">enum</param>
        /// <param name="valueColName">name of value col e.g., Id</param>
        /// <param name="labelColName">name of label column e.g., Text</param>
        /// <param name="addEmptyRow">if need to add an empty row</param>
        /// <param name="sortByName">if need to sort by text</param>
        /// <param name="useStringValue">if need to use StringValue as display text</param>
        /// <returns>data table</returns>
        public static DataTable GetDatatableFromEnum(Type enumType, string valueColName, string labelColName, bool addEmptyRow, bool sortByName, bool useStringValue = false, string sortString = "ASC")
        {

            StringEnum se = new StringEnum(enumType);
            DataTable dtTemp = new DataTable("dataList");
            dtTemp.Columns.Add(valueColName, typeof(int));
            dtTemp.Columns.Add(labelColName, typeof(string));
            Array names = System.Enum.GetNames(enumType);
            int i = 0;
            foreach (int val in System.Enum.GetValues(enumType))
            {

                DataRow dr = dtTemp.NewRow();
                dr[valueColName] = val;
                if (useStringValue)
                {
                    string str = se.GetStringValue(dr[valueColName].ToInt());
                    dr[labelColName] = String.IsNullOrEmpty(str) ? string.Empty : str;
                }
                else
                {
                    string name = GetString(names.GetValue(i));
                    dr[labelColName] = name == null ? String.Empty : name.Replace("_n_", " ").Replace("_", " ");
                }
                dtTemp.Rows.Add(dr);
                dtTemp.AcceptChanges();
                i++;
            }
            var view = dtTemp.DefaultView;
            if (sortByName)
            {
                view.Sort = labelColName + " " + sortString;
            }
            else
            {
                view.Sort = valueColName + " " + sortString;
            }
            dtTemp = view.ToTable();
            if (addEmptyRow)
            {
                DataRow dr = dtTemp.NewRow();
                dr[valueColName] = DBNull.Value;
                dr[labelColName] = DBNull.Value;
                dtTemp.Rows.InsertAt(dr, 0);
                dtTemp.AcceptChanges();
            }
            return dtTemp;
        }
        /// <summary>
        /// Get dictionary from enum
        /// </summary>
        /// <param name="enumType"></param>       
        /// <returns></returns>
        public static Dictionary<int, string> GetDictionaryFromEnum(Type enumType)
        {
            if (enumType == null) return null;
            var dic = new Dictionary<int, string>();
            foreach (int val in System.Enum.GetValues(enumType))
            {
                if (dic.ContainsKey(val)) throw new InvalidOperationException("Duplicate value in enum type " + enumType.GetType());
                dic.Add(val, val.GetEnumString(enumType));
            }
            return dic;
        }
        /// <summary>
        /// Convert Data Table from IEnumerable
        /// </summary>
        /// <param name="ien">query</param>
        /// <param name="setNullForEmptyColumns">returns null if no columns found</param>
        /// <returns></returns>
        public static DataTable GetDataTableFromIEnumerable(System.Collections.IEnumerable ien, bool setNullForEmptyColumns)
        {
            if (!setNullForEmptyColumns) return GetDataTableFromIEnumerable(ien);
            else
            {
                DataTable dt = GetDataTableFromIEnumerable(ien);
                if (dt == null || dt.Columns.Count <= 0) return null;
                else return dt;
            }
        }
        /// <summary>
        /// Get DataTable from IEnumerable
        /// </summary>
        /// <param name="ien">IEnumerable object</param>
        /// <returns>DataTable</returns>
        public static DataTable GetDataTableFromIEnumerable(System.Collections.IEnumerable ien)
        {
            if (ien == null) return null;
            DataTable dt = new DataTable();
            Type type = ien.AsQueryable().ElementType;
            PropertyInfo[] pis = type.GetProperties();
            foreach (PropertyInfo pi in pis)
            {
                dt.Columns.Add(pi.Name, Nullable.GetUnderlyingType(pi.PropertyType) ?? pi.PropertyType);
            }

            foreach (var obj in ien)
            {
                DataRow dr = dt.NewRow();
                foreach (PropertyInfo pi in pis)
                {
                    object value = pi.GetValue(obj, null);
                    dr[pi.Name] = value ?? System.DBNull.Value;
                }
                dt.Rows.Add(dr);

            }
            //if (dt != null && dt.Columns.Count <= 0) return null;
            return dt;
        }
        /// <summary>
        /// get data table from enum list
        /// </summary>
        /// <param name="enumType">enum</param>
        /// <param name="ColumnName">column name of value col e.g., Id</param>
        /// <returns>data table</returns>
        public static DataTable GetDataTableFromEnum(Type enumType, string ColumnName)
        {
            return GetDatatableFromEnum(enumType, "Id", ColumnName, false, true);
        }
        /// <summary>
        /// get data table from enum list
        /// </summary>
        /// <param name="enumType">type</param>
        /// <param name="ColumnName">name of the column</param>
        /// <param name="isAddEmptyRow">is empty empty row need to be added</param>
        /// <param name="isSortByName">is sort by name</param>
        /// <param name="isUseStringVal">is string value used</param>
        /// <returns>data table</returns>
        public static DataTable GetDataTableFromEnum(Type enumType, string ColumnName, bool isAddEmptyRow = false, bool isSortByName = true, bool isUseStringVal = false)
        {
            return GetDatatableFromEnum(enumType, "Id", ColumnName, isAddEmptyRow, isSortByName, isUseStringVal);
        }

        #endregion

        #region Utility
        /// <summary>
        /// Get Column Names as Data Table from another datatable
        /// Cols: ColumnName
        /// </summary>
        /// <param name="sourceDataTable"></param>
        /// <param name="sortByName"></param>
        /// <returns></returns>
        public static DataTable GetColumnNamesAsDataTable(DataTable sourceDataTable, bool sortByName = true)
        {
            if (sourceDataTable == null || sourceDataTable.Columns.Count <= 0) return null;
            else
            {
                var dataTable = new DataTable("ColumnNamesTable");
                dataTable.Columns.Add("ColumnName");
                foreach (DataColumn col in sourceDataTable.Columns)
                {
                    var row = dataTable.NewRow();
                    row["ColumnName"] = col.ColumnName;
                    dataTable.Rows.Add(row);
                }
                dataTable.AcceptChanges();
                if (sortByName)
                {
                    var dv = dataTable.DefaultView;
                    dv.Sort = "ColumnName ASC";
                    return dv.ToTable();
                }
                else return dataTable;
            }
        }

        /// <summary>
        /// Format a script within javascript tags
        /// </summary>
        /// <param name="script"></param>
        /// <returns></returns>
        public static string GetFormattedJavascriptBlock(string script)
        {
            return string.Format("<script type='text/javascript'> {0} </script>", script);
        }
        /// <summary>
        /// Get Week Number
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static int GetWeekNumber(DateTime date)
        {
            return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }
        /// <summary>
        /// Compare TimeStamp Value
        /// </summary>
        /// <param name="value1">First Value</param>
        /// <param name="value2">Second Value</param>
        /// <returns>Compared Result</returns>
        public static bool CompareTimeStamp(byte[] value1, byte[] value2)
        {
            if (value1.IsNull() && value2.IsNull()) return true;   //both are null            
            else if (value1.IsNull() || value2.IsNull()) return false;  // only one is null

            if (value1.Length != value2.Length) return false;

            for (int index = 0; index < value1.Length; index++)
            {
                if (value1[index] != value2[index]) return false;   // any index value isn't equal.
            }

            return true;
        }

        #endregion

        #region String utility
        /// <summary>
        /// Removes special characters from inputted text
        /// </summary>
        /// <param name="input">Input Text</param>
        /// <returns>Special characters removed text</returns>
        public static string RemoveSpecialCharacters(string input)
        {
            return ReplaceSpecialCharacters(input, string.Empty);
        }
        /// <summary>
        /// Replaces special characters from a inputted text
        /// </summary>
        /// <param name="input">Input Text</param>
        /// <param name="replacedBy">Replaced By Text</param>
        /// <param name="r">Regular Expression</param>
        /// <returns></returns>
        public static string ReplaceSpecialCharacters(string input, string replacedBy = "", Regex r = null)
        {
            if (r == null)
            {
                r = new Regex("(?:[^a-z0-9 ]|(?<=['\"])s)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);
            }
            return r.Replace(input, replacedBy);
        }
        /// <summary>
        /// Get fixed width string
        /// </summary>
        /// <param name="input"></param>
        /// <param name="length"></param>
        /// <param name="padding"></param>
        /// <param name="rightJustify"></param>
        /// <returns></returns>
        public static string GetFixedWidthString(string input, int length, char padding = ' ', bool rightJustify = false)
        {
            char[] output = new char[length];
            if (rightJustify) input = new string(input.Reverse().ToArray());

            for (int i = 0; i < length; i++)
            {
                if (i < input.Length)
                    output[i] = input[i];
                else
                    output[i] = padding;
            }

            if (rightJustify) output = output.Reverse().ToArray();
            return new string(output);
        }
        #endregion

        #region Serialization

        /// <summary>
        /// GetXmlSerializeBytes
        /// </summary>
        /// <param name="data"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static byte[] GetXmlSerializeBytes(object data, Type type = null)
        {
            if (data == null) return null;
            var serializer = new System.Xml.Serialization.XmlSerializer(type ?? data.GetType());
            using (MemoryStream stream = new MemoryStream())
            {
                serializer.Serialize(stream, data);
                return stream.ToArray();
            }
        }
        /// <summary>
        /// GetXmlDeserializeObject
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object GetXmlDeserializeObject(byte[] bytes, Type type)
        {
            if (bytes == null) return null;
            try
            {
                var serializer = new System.Xml.Serialization.XmlSerializer(type);
                using (MemoryStream stream = new MemoryStream(bytes))
                {
                    return serializer.Deserialize(stream);
                }
            }
            catch { return null; }
        }
        /// <summary>
        /// CopyXmlSerializableObject
        /// </summary>
        /// <param name="data"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object CopyXmlSerializableObject(object data, Type type)
        {
            var bytes = GetXmlSerializeBytes(data, type);
            return GetXmlDeserializeObject(bytes, type);
        }

        /// <summary>
        /// get deserialized object
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static object GetDeserializeObject(byte[] bytes)
        {
            if (bytes == null) return null;
            try
            {
                using (var memoryStream = new MemoryStream(bytes))
                {
                    var binaryFormatter = new BinaryFormatter();
                    var data = binaryFormatter.Deserialize(memoryStream);
                    return data;
                }
            }
            catch { return null; }
        }
        /// <summary>
        /// Get serialise bytes
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static byte[] GetSerializeBytes(object data)
        {
            if (data == null) return null;
            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();
                binaryFormatter.Serialize(memoryStream, data);
                return memoryStream.ToArray();
            }
        }
        /// <summary>
        /// Copy a serializable object
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static object CopySerializableObject(object data)
        {
            var bytes = GetSerializeBytes(data);
            return GetDeserializeObject(bytes);
        }

        #endregion

        #region Utils
        /// <summary>
        /// Get object from DataTable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="table"></param>
        /// <returns></returns>
        public static T GetObjectFromDataTable<T>(DataTable table)
        {
            var obj = Activator.CreateInstance(typeof(T));

            if (table.Rows.Count > 0)
            {
                //we are only concerned with the first row because in our datatable, we should only have one row per table
                var row = table.Rows[0];

                foreach (DataColumn col in table.Columns)
                {
                    var propInfo = obj.GetType().GetProperty(col.ColumnName);
                    if (propInfo == null) continue;

                    object colValue;
                    if (propInfo.PropertyType == typeof(Guid))
                    {
                        colValue = Guid.Parse(row[col.ColumnName].ToString());
                        propInfo.SetValue(obj, colValue, null);
                    }
                    else
                    {
                        //TODO -- Readonly property isn't considered here. We need to consider it
                        try
                        {
                            var targetType = IsNullableType(propInfo.PropertyType) ? Nullable.GetUnderlyingType(propInfo.PropertyType) : propInfo.PropertyType;

                            colValue = Convert.ChangeType(row[col.ColumnName], targetType);

                            //Checking readonly properties
                            if (propInfo.CanWrite)
                                propInfo.SetValue(obj, colValue, null);
                        }
                        catch
                        {
                            colValue = row[col.ColumnName];
                            if (colValue.GetType() == typeof(System.DBNull))
                            {
                                colValue = null;
                            }
                            propInfo.SetValue(obj, colValue, null);
                        }
                    }
                }
            }
            return (T)obj;
        }
        /// <summary>
        /// Check nullable data type
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsNullableType(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static DataTable GetDataTableFromObject(object entity)
        {
            if (entity == null) return null;
            if (entity is DataTable) return (entity as DataTable);
            //Dynamically create a DataTable based on the Properties
            Type type = entity.GetType();
            System.Reflection.PropertyInfo[] properties = type.GetProperties();
            System.Data.DataTable dt = new System.Data.DataTable();
            foreach (System.Reflection.PropertyInfo pi in properties)
            {
                if (!(pi.PropertyType.Namespace.Contains("System.Data")))
                {
                    try
                    {
                        var targetType = IsNullableType(pi.PropertyType) ? Nullable.GetUnderlyingType(pi.PropertyType) : pi.PropertyType;
                        dt.Columns.Add(pi.Name, targetType);
                    }
                    catch
                    {
                        dt.Columns.Add(pi.Name, typeof(System.Object));
                    }
                }
            }

            System.Data.DataRow dr = dt.NewRow();
            foreach (System.Reflection.PropertyInfo pi in properties)
            {
                if (!(pi.PropertyType.Namespace.Contains("System.Data")))
                {
                    dr[pi.Name] = pi.GetValue(entity, null) ?? DBNull.Value;
                }
            }

            dt.Rows.Add(dr);

            return dt;
        }
       
        /// <summary>
        /// Get type from a full type name
        /// </summary>
        /// <param name="typeFullName">e.g., Itm.Enums.CustomCategory or Itm.Crm.CustomerController</param>
        /// <returns></returns>
        public static Type GetType(string typeFullName)
        {
            if (string.IsNullOrEmpty(typeFullName)) throw new ArgumentException("Typename is null");
            List<System.Reflection.Assembly> assemblies = AppDomain.CurrentDomain.GetAssemblies().ToList();
            foreach (var assembly in assemblies)
            {
                Type type = assembly.GetType(typeFullName, false);
                if (type != null)
                    return type;
            }
            throw new ArgumentException("Type " + typeFullName + " doesn't exist in the current application domain");
        }

        /// <summary>
        /// Get DayOfWeek datatable 
        /// </summary>
        /// <param name="valueColName"></param>
        /// <param name="labelColName"></param>
        /// <param name="addEmptyRow"></param>
        /// <returns></returns>
        public static DataTable GetDayOfWeekDataTable(string valueColName = "Id", string labelColName = "Name", bool addEmptyRow = false)
        {
            DataTable dtDayOfWeek = new DataTable();

            dtDayOfWeek.Columns.Add(valueColName, typeof(int));
            dtDayOfWeek.Columns.Add(labelColName, typeof(string));

            dtDayOfWeek.Rows.Add((int)DayOfWeek.Monday, DayOfWeek.Monday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Tuesday, DayOfWeek.Tuesday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Wednesday, DayOfWeek.Wednesday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Thursday, DayOfWeek.Thursday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Friday, DayOfWeek.Friday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Saturday, DayOfWeek.Saturday.ToString());
            dtDayOfWeek.Rows.Add((int)DayOfWeek.Sunday, DayOfWeek.Sunday.ToString());

            if (addEmptyRow)
            {
                DataRow drTemp = dtDayOfWeek.NewRow();

                dtDayOfWeek.Rows.InsertAt(drTemp, 0);
            }

            return dtDayOfWeek;
        }
        #endregion
    }
}
