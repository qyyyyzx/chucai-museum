/**
 * @file 地理距离计算工具
 * @module lbs/domain/distance
 *
 * 纯数学函数，无任何副作用，可安全在 domain 层使用。
 * 使用 Haversine 公式计算球面距离。
 */

/** 地球平均半径（千米） */
const EARTH_RADIUS_KM = 6371;

/**
 * 将角度转换为弧度
 * @param {number} deg - 角度
 * @returns {number} 弧度
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * 使用 Haversine 公式计算两点之间的球面距离
 * @param {number} lat1 - 起点纬度
 * @param {number} lon1 - 起点经度
 * @param {number} lat2 - 终点纬度
 * @param {number} lon2 - 终点经度
 * @returns {number} 距离（单位：千米），保留两位小数
 */
export function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 100) / 100;
}

/**
 * 将距离（千米）格式化为用户友好的字符串
 * - 小于 1 km 时显示为米，如"850 m"
 * - 大于等于 1 km 时显示为千米，如"1.20 km"
 * @param {number} km - 距离（千米）
 * @returns {string} 格式化后的距离字符串
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(2)} km`;
}

/**
 * 为餐厅列表补充距离字段并按距离升序排序
 * @param {Array<{coordinates: {latitude: number, longitude: number}}>} restaurants - 餐厅列表
 * @param {number} userLat - 用户纬度
 * @param {number} userLon - 用户经度
 * @returns {Array} 附带 distanceKm 和 distanceText 字段的餐厅列表（升序）
 */
export function sortRestaurantsByDistance(restaurants, userLat, userLon) {
  return restaurants
    .map((r) => {
      const distanceKm = calcDistanceKm(
        userLat,
        userLon,
        r.coordinates.latitude,
        r.coordinates.longitude,
      );
      return {
        ...r,
        distanceKm,
        distanceText: formatDistance(distanceKm),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
