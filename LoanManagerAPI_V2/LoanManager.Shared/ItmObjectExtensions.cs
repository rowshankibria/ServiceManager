using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LoanManager.Shared
{
    public static class ItmObjectExtensions
    {

        #region Class Extension
        /// <summary>
        /// Set values to object
        /// </summary>
        /// <typeparam name="TEntity">Entity Type</typeparam>
        /// <param name="oClass">Object</param>
        /// <param name="dr">DataRow</param>
        /// <returns>TEntity</returns>
        public static TEntity SetValuesToObject<TEntity>(this object oClass, DataRow dr)
        {
            oClass = GetObject(oClass, dr);
            return (TEntity)oClass;
        }
        /// <summary>
        /// Get object
        /// </summary>
        /// <param name="oClass">Object</param>
        /// <param name="dr">DataRow</param>
        /// <returns>Object</returns>
        private static object GetObject(object oClass, DataRow dr)
        {
            MemberInfo[] methods = oClass.GetType().GetMethods();
            ArrayList aMethods = new ArrayList();
            object[] aoParam = new object[1];

            //Get simple SET methods            
            foreach (MethodInfo method in methods)
            {
                if (method.DeclaringType == oClass.GetType() && method.Name.StartsWith("set_"))
                    aMethods.Add(method);
            }

            //Invoke each set method with mapped value                                         
            for (int i = 0; i < aMethods.Count; i++)
            {
                MethodInfo mInvoke = (MethodInfo)aMethods[i];
                //Remove "set_" from method name
                string sColumn = mInvoke.Name.Remove(0, 4);
                //If row contains value for method...
                if (dr.Table.Columns.Contains(sColumn))
                {
                    //Get the parameter (always one for a set property)
                    ParameterInfo[] api = mInvoke.GetParameters();
                    ParameterInfo pi = api[0];
                    //Convert value to parameter type
                    if (dr[sColumn] == System.DBNull.Value)
                        aoParam[0] = null;
                    else
                        aoParam[0] = Convert.ChangeType(dr[sColumn], Nullable.GetUnderlyingType(pi.ParameterType) ?? pi.ParameterType);
                    //Invoke the method   
                    mInvoke.Invoke(oClass, aoParam);
                }
            }
            return oClass;
        }

        private static readonly Regex _isNumber = new Regex(@"^\d+$");
        /// <summary>
        /// Determines whether the specified obj is numeric.
        /// </summary>
        /// <param name="obj">The obj.</param>
        /// <returns>
        /// 	<c>true</c> if the specified obj is numeric; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsNumeric(this object obj)
        {
            return obj != null && _isNumber.Match(obj.ToString()).Success;
        }
        /// <summary>
        /// Ins the specified obj.
        /// </summary>
        /// <param name="obj">The obj.</param>
        /// <param name="enumerable">The enumerable.</param>
        /// <returns></returns>
        public static bool In(this object obj, IEnumerable enumerable)
        {
            return enumerable.Cast<object>().Contains(obj);
        }
        /// <summary>
        /// add or set dictionary
        /// </summary>
        /// <param name="dictionary"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void AddOrSet(this Dictionary<string, object> dictionary, string key, object value)
        {
            if (dictionary == null) dictionary = new Dictionary<string, object>();
            if (dictionary.ContainsKey(key)) dictionary[key] = value;
            else dictionary.Add(key, value);
        }
        /// <summary>
        /// add or set dictionary
        /// </summary>
        /// <param name="dictionary"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void AddOrSet(this Dictionary<string, string> dictionary, string key, string value)
        {
            if (dictionary == null) dictionary = new Dictionary<string, string>();
            if (dictionary.ContainsKey(key)) dictionary[key] = value;
            else dictionary.Add(key, value);
        }
        /// <summary>
        /// Get Dictionary value
        /// </summary>
        /// <param name="dictionary"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static object GetValue(this Dictionary<string, object> dictionary, string key)
        {
            if (key == null) return null;
            if (dictionary == null) return null;
            if (!dictionary.ContainsKey(key)) return null;
            return dictionary[key];
        }
        /// <summary>
        /// Ins the specified obj.
        /// </summary>
        /// <param name="obj">The obj.</param>
        /// <param name="enumerable">The enumerable.</param>
        /// <returns></returns>
        public static bool In<T>(this object obj, IEnumerable<T> enumerable)
        {
            return obj is T && enumerable.Contains((T)obj);
        }
        /// <summary>
        /// Determines whether the specified o is null.
        /// </summary>
        /// <param name="o">The o.</param>
        /// <returns>
        /// 	<c>true</c> if the specified o is null; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsNull(this object o)
        {
            return o == null ? true : (o.GetType() == typeof(Guid) ? o.ToGuid() == Guid.Empty : false);
        }
        /// <summary>
        /// Is Guid Empty
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static bool IsEmpty(this Guid guid)
        {
            return guid == null || guid == Guid.Empty;
        }
        public static bool IsNotEmpty(this Guid guid)
        {
            return !IsEmpty(guid);
        }
        public static bool IsEmpty(this Guid? guid)
        {
            return guid == null ? true : guid == Guid.Empty;
        }
        public static bool IsNotEmpty(this Guid? guid)
        {
            return !IsEmpty(guid);
        }
        /// <summary>
        /// Determines whether [is not null] [the specified o].
        /// </summary>
        /// <param name="o">The o.</param>
        /// <returns>
        /// 	<c>true</c> if [is not null] [the specified o]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsNotNull(this object o)
        {
            return o != null;
        }
        /// <summary>
        /// Returns all the public properties as a list of Name, Value pairs
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public static IEnumerable<KeyValuePair<string, object>> GetProperties(this object item)
        {
            foreach (PropertyInfo property in item.GetType().GetProperties())
            {
                yield return new KeyValuePair<string, object>(property.Name, property.GetValue(item, null));
            }
        }
        /// <summary>
        ///  if the object is null then return specified string
        /// </summary>
        /// <param name="s">object s</param>
        /// <param name="nullValue">string to return when object is null</param>
        /// <returns> if [s is null] [the specified nullValue]; otherwise s.ToString()  </returns>
        public static string ToString(this object s, string nullValue)
        {
            return (s == null ? nullValue : s.ToString());

        }
        /// <summary>
        /// convert to Guid
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>zero if null</returns>
        public static Guid ToGuid(this object obj)
        {
            return ItmData.GetGuid(obj);
        }
        /// <summary>
        /// convert to int
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>zero if null</returns>
        public static int ToInt(this object obj)
        {
            return ItmData.GetInteger(obj);
        }
        /// <summary>
        /// convert to string
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>null if null</returns>
        public static string ToString(this object obj)
        {
            return ItmData.GetString(obj);
        }
        /// <summary>
        /// ToEnumerableString
        /// </summary>
        /// <param name="items"></param>
        /// <param name="seperator"></param>
        /// <param name="ignoreZero"></param>
        /// <param name="returnNullOnEmpty"></param>
        /// <returns></returns>
        public static string ToEnumerableString(this List<Guid> items, string seperator = ",", bool ignoreZero = true, bool returnNullOnEmpty = true)
        {
            if (items == null || items.Count <= 0)
                return returnNullOnEmpty ? null : string.Empty;
            return string.Join(seperator, items.Where(t => (ignoreZero ? t != Guid.Empty : true)));
        }
        /// <summary>
        /// Get String Value of the Enum
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string GetEnumString(this object obj, Type type)
        {
            StringEnum str = new StringEnum(type);
            return str.GetStringValue(obj.ToInt());
        }
        /// <summary>
        /// convert to date time
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>min date time if null</returns>
        public static DateTime ToDateTime(this object obj)
        {
            return ItmData.GetDateTime(obj);
        }
        /// <summary>
        /// convert to decimal
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>zero if null</returns>
        public static decimal ToDecimal(this object obj)
        {
            return ItmData.GetDecimal(obj);

        }
        /// <summary>
        /// convert to double
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>zero if null</returns>
        public static double ToDouble(this object obj)
        {
            return ItmData.GetDouble(obj);
        }
        /// <summary>
        /// convert to boolean
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>false if null</returns>
        public static bool ToBoolean(this object obj)
        {
            return ItmData.GetBoolean(obj);
        }
        /// <summary>
        /// Get string value
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>String value</returns>
        public static string GetString(this object obj)
        {
            return ItmData.GetString(obj);
        }
        /// <summary>
        /// populating combo/lookup controk from Enum with key value pair?
        /// </summary>
        /// <param name="type">pass the type</param>
        /// <returns></returns>
        public static IList ToList(this Type type)
        {
            if (type == null)
            {
                throw new ArgumentNullException("type");
            }
            if (!type.IsEnum)
                throw new ArgumentException(String.Format("Supplied type must be an Enum.  Type was {0}", type.ToString()));
            StringEnum str = new StringEnum(type);
            return str.GetListValues();
        }
        /// <summary>
        /// Convert an IEnumerable to a Data Table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(this IEnumerable<T> items)
        {
            if (items == null) return null;
            var tb = new DataTable(typeof(T).Name.ToLower().Contains("anonymous") ? "dataTable" : typeof(T).Name);
            PropertyInfo[] props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var prop in props)
            {
                Type dataType = prop.PropertyType;
                if (dataType.IsGenericType && dataType.GetGenericTypeDefinition() == typeof(System.Nullable<>))
                {
                    dataType = System.Nullable.GetUnderlyingType(dataType);
                }
                tb.Columns.Add(prop.Name, dataType);
            }
            foreach (var item in items)
            {
                var values = new object[props.Length];
                for (var i = 0; i < props.Length; i++)
                {
                    var value = props[i].GetValue(item, null);
                    if (value == null) value = DBNull.Value;
                    values[i] = value;
                }
                tb.Rows.Add(values);
            }
            if (tb != null && tb.Columns.Count <= 0) return null;
            return tb;
        }
        /// <summary>
        /// Fill DataTable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <param name="dataTable"></param>
        public static void FillDataTable<T>(this IEnumerable<T> items, DataTable dataTable)
        {
            if (items == null) return;
            PropertyInfo[] props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var item in items)
            {
                DataRow dr = dataTable.NewRow();
                //var values = new object[props.Length];
                foreach (var prop in props)
                {
                    if (dataTable.Columns.Contains(prop.Name))
                    {
                        var value = prop.GetValue(item, null);
                        if (value == null) value = DBNull.Value;
                        dr[prop.Name] = value;
                    }
                }
                dataTable.Rows.Add(dr);
            }
        }
        /// <summary>
        /// Convert IEnumerable to Data Table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(this IEnumerable<T> items, string tableName)
        {
            DataTable dt = ToDataTable(items);
            if (dt != null) dt.TableName = tableName;
            return dt;
        }
        /// <summary>
        /// Get Start of the week
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="startOfWeek"></param>
        /// <returns></returns>
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            if (dt == null || dt == DateTime.MinValue) return dt;
            int diff = dt.DayOfWeek - startOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(-1 * diff).Date;
        }
        /// <summary>
        /// Get end of the week
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="startOfWeek"></param>
        /// <returns></returns>
        public static DateTime EndOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            if (dt == null || dt == DateTime.MinValue) return dt;
            var startDate = dt.StartOfWeek(startOfWeek);
            if (startDate != null && startDate != DateTime.MinValue)
                return startDate.AddDays(6);
            else return dt;
        }
        /// <summary>
        /// Convert to local date time
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="timeZoneID"></param>
        /// <param name="kind"></param>
        /// <returns></returns>
        public static DateTime ToLocalDateTime(this DateTime dt, string timeZoneID, DateTimeKind kind = DateTimeKind.Local)
        {
            if (dt == DateTime.MinValue || string.IsNullOrEmpty(timeZoneID)) return dt;
            else
            {
                dt = (dt.Kind != kind ? new DateTime(dt.Ticks, kind) : dt);
                TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timeZoneID);
                return TimeZoneInfo.ConvertTime(dt, tzi);
            }
        }

        /// <summary>
        /// Convert to UTC date time
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="timeZoneID"></param>        
        /// <returns></returns>
        public static DateTime ToUtcDateTime(this DateTime dt, string timeZoneID)
        {
            if (dt == DateTime.MinValue || string.IsNullOrEmpty(timeZoneID)) return dt;
            else
            {
                dt = (dt.Kind != DateTimeKind.Unspecified ? new DateTime(dt.Ticks, DateTimeKind.Unspecified) : dt);

                TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timeZoneID);

                return TimeZoneInfo.ConvertTimeToUtc(dt, tzi);
            }
        }

        /// <summary>
        /// Convert to logged in user's local time zone
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="kind"></param>
        /// <returns></returns>
        public static DateTime ToUserLocalDateTime(this DateTime dt, DateTimeKind kind = DateTimeKind.Local)
        {
            //todo:Hasan
            //return ToLocalDateTime(dt, Itm.Utils.Environments.LoggedInUserTimeZoneID, kind);
            return new DateTime();
        }
        /// <summary>
        /// set first character upper case
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string SetFirstCharacterUpper(this string str)
        {
            return string.IsNullOrEmpty(str) ? str : str.FirstOrDefault().ToString().ToUpper() + (str.Length > 1 ? str.Substring(1, str.Length - 1) : "");
        }
        //todo:Hasan
        ///// <summary>
        ///// Convert string to size
        ///// format: 120,23
        ///// </summary>
        ///// <param name="value"></param>
        ///// <returns></returns>
        //public static System.Drawing.Size ToSize(this string value)
        //{            
        //    if (!string.IsNullOrWhiteSpace(value) && value.Split(',').Length > 1)
        //        return new System.Drawing.Size(Itm.Data.GetInteger(value.Split(',')[0]), Itm.Data.GetInteger(value.Split(',')[1]));
        //    else return new System.Drawing.Size();
        //}
        /// <summary>
        /// convert control value for nullable property value
        /// </summary>
        /// <param name="value"></param>
        public static Guid? ToPropertyValue(this object value)
        {
            return value.ToGuid().IsEmpty() ? new Guid?() : value.ToGuid();
        }

        /// <summary>
        /// ToPropertyDateTime
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime? ToPropertyDateTime(this DateTime value)
        {
            if (value == DateTime.MinValue) return null;
            else return value;
        }
        //todo:Hasan
        ///// <summary>
        ///// get time string
        ///// </summary>
        ///// <param name="timeSpan"></param>
        ///// <returns></returns>
        //public static string ToTimeString(this TimeSpan timeSpan)
        //{
        //    return (new DateTime().AddHours(timeSpan.Hours).AddMinutes(timeSpan.Minutes)).ToString(Itm.Utils.Environments.DefaultTimeFormat);
        //}

        /// <summary>
        /// Get String fron byte array
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string GetString(this byte[] bytes)
        {
            if (bytes == null) return null;
            else return System.Text.ASCIIEncoding.ASCII.GetString(bytes);
        }

        /// <summary>
        /// ToEnum from StringValueAttribute
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="str"></param>
        /// <returns></returns>
        public static T ToEnum<T>(this string str)
        {
            foreach (T item in Enum.GetValues(typeof(T)))
            {
                StringValueAttribute[] attributes = (StringValueAttribute[])item.GetType().GetField(item.ToString()).GetCustomAttributes(typeof(StringValueAttribute), false);
                if ((attributes != null) && (attributes.Length > 0) && (attributes[0].Value.Equals(str)))
                {
                    return item;
                }
            }
            return (T)Enum.Parse(typeof(T), str, true);
        }
        #endregion


    }
}

