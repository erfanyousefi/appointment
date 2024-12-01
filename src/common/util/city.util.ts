import {BadRequestException} from "@nestjs/common";
import provinces from "../jsons/provinces";
import cities from "./../jsons/cities";

interface City {
  id: number;
  name: string;
  slug: string;
  province_id: number;
}

interface Province {
  id: number;
  name: string;
  slug: string;
}

// Return all cities
export function getAllCities(): City[] {
  return cities;
}

// Return all provinces
export function getAllProvinces(): Province[] {
  return provinces;
}
// Return all provinces
export function getProvinceNameById(id: number): string {
  return provinces.find((province: Province) => province.id === id)?.name;
}
export function getProvinceByName(name: string): Province {
  return provinces.find((province: Province) => province.name === name);
}

// Return all the cities of a specific province based on province's name
export function getCitiesByProvinceName(name: string): City[] {
  const province = provinces.find((p) => p.name === name);
  if (!province) return [];
  return cities.filter((city) => city.province_id === province.id);
}

// Return all the cities of a specific province based on province's ID
export function getCitiesByProvinceId(id: number): City[] {
  return cities.filter((city: City) => city.province_id === id);
}

// Return all the cities of a specific province based on province's slug
export function getCitiesByProvinceSlug(slug: string): City[] {
  const province = provinces.find((p) => p.slug === slug);
  if (!province) return [];
  return cities.filter((city: City) => city.province_id === province.id);
}

// Find city information by name
export function getCityByName(name: string): City {
  return cities.find((city: City) => city.name === name);
}

// Find city information by ID
export function getCityById(id: number): City {
  return cities.find((city: City) => city.id === id);
}

// Find city information by slug
export function getCityBySlug(slug: string): City[] {
  return cities.filter((city: City) => city.slug === slug);
}

export function getCityAndProvinceNameByCode(
  provinceId: number,
  cityId: number
) {
  let cityName: string, provinceName: string;
  if (provinceId) {
    provinceName = getProvinceNameById(+provinceId);
    if (provinceName && cityId) {
      let cityRow = getCityById(+cityId);
      if (cityRow.province_id == provinceId) {
        cityName = cityRow.name;
      } else {
        throw new BadRequestException(
          "شهر و استان انتخاب شده باهمدیگر تطابق ندارند"
        );
      }
    }
  }
  return {provinceName, cityName};
}
