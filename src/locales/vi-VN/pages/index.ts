import dangky from './dichvuhanhchinh/dangky';
import lichsu from './dichvuhanhchinh/lichsu';
import donvihanhchinh from './donvihanhchinh';
import dangkytinchi from './hoctap/dangkytinchi';
import chungchitotnghiep from './hoctap/chungchi';
import dieukientotnghiep from './hoctap/dieukientotnghiep';
import hoctapkhac from './hoctap/khac';
import ketquahoctap from './ketquahoctap';
import khaosat from './khaosat';
import lichsukien from './lichsukien';
import login from './login';
import lophanhchinh from './lophanhchinh';
import lophocphan from './lophocphan';
import phanhoi from './phanhoi';
import congno from './taichinh/congno';
import lichsugiaodich from './taichinh/lichsugiaodich';
import uudaithanhtoan from './taichinh/uudaithanhtoan';
import thongbao from './thongbao';
import thongtincanhan from './thongtincanhan';
import cauhoithuonggap from './tienichkhac/cauhoithuonggap';
import vanbanhuongdan from './tienichkhac/vanbanhuongdan';
import xemsau from './tienichkhac/xemsau';
import tientrinhhoctap from './tientrinhhoctap';
import trangchu from './trangchu';
import dangkynhucau from './hoctap/dangkynhucau';
import tintuc from './tintuc'

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
	...tintuc
};
