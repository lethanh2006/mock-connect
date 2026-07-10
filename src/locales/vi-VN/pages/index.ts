import activity from './cct/activity';
import dangky from './dichvuhanhchinh/dangky';
import lichsu from './dichvuhanhchinh/lichsu';
import diemrenluyen from './diemrenluyen';
import donvihanhchinh from './donvihanhchinh';
import baithicuoiky from './hoctap/baithicuoiky';
import chungchitotnghiep from './hoctap/chungchi';
import dangkynhucau from './hoctap/dangkynhucau';
import dangkytinchi from './hoctap/dangkytinchi';
import dieukientotnghiep from './hoctap/dieukientotnghiep';
import hocphannhucau from './hoctap/hocphannhucau';
import ketquahoctap from './hoctap/ketquahoctap';
import hoctapkhac from './hoctap/khac';
import lichthi from './hoctap/lichthi';
import lophocphan from './hoctap/lophocphan';
import tientrinhhoctap from './hoctap/tientrinhhoctap';
import khaosat from './khaosat';
import detaikhcn from './khoahoc/detaikhcn';
import lichsukien from './lichsukien';
import login from './login';
import lophanhchinh from './lophanhchinh';
import minor from './minor';
import phanhoi from './phanhoi';
import sinhvien from './sinhvien';
import syllabus from './syllabus';
import congno from './taichinh/congno';
import lichsugiaodich from './taichinh/lichsugiaodich';
import uudaithanhtoan from './taichinh/uudaithanhtoan';
import thongbao from './thongbao';
import thongtincanhan from './thongtincanhan';
import cauhoithuonggap from './tienichkhac/cauhoithuonggap';
import vanbanhuongdan from './tienichkhac/vanbanhuongdan';
import xemsau from './tienichkhac/xemsau';
import tintuc from './tintuc';
import trangchu from './trangchu';

export default {
	...login,
	...trangchu,
	...thongtincanhan,
	...donvihanhchinh,
	...lichsukien,
	...lophanhchinh,
	...hoctapkhac,
	...lophocphan,
	...tientrinhhoctap,
	...ketquahoctap,
	...dangkytinchi,
	...chungchitotnghiep,
	...dieukientotnghiep,
	...khaosat,
	...phanhoi,
	...thongbao,
	...cauhoithuonggap,
	...vanbanhuongdan,
	...xemsau,
	...congno,
	...lichsugiaodich,
	...uudaithanhtoan,
	...dangky,
	...lichsu,
	...dangkynhucau,
	...hocphannhucau,
	...tintuc,
	...lichthi,
	...baithicuoiky,
	...activity,
	...diemrenluyen,
	...sinhvien,
	...minor,
	...syllabus,
	...detaikhcn,

	'pages.trangchu.title': 'PHÂN HỆ CỔNG SINH VIÊN',
	'pages.trangchu.subtitle': 'HỆ THỐNG ĐẠI HỌC SỐ',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
};
