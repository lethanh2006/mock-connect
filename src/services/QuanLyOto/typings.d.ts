import type { ELoaiXe } from '@/utils/constants';

declare module QuanLyOto {
  export interface Record {
    _id: string;
    hoTen: string;
    donVi: string;
    bienSoXe: string;
    hangXe: string;
    tenXe: string;
    soDienThoai: string;
    email: string;
    loaiXe: ELoaiXe;
  }
  export interface RecordImport {
    dataHopLe: any[];
    dataKhongHopLe: any[];
    dataTrung: any[];
  }
}
