import donvihanhchinh from './donvihanhchinh';
import hoctapkhac from './hoctap/khac';
import ketquahoctap from './ketquahoctap';
import khaosat from './khaosat';
import lichsukien from './lichsukien';
import login from './login';
import lophanhchinh from './lophanhchinh';
import lophocphan from './lophocphan';
import phanhoi from './phanhoi';
import thongbao from './thongbao';
import thongtincanhan from './thongtincanhan';
import cauhoithuonggap from './tienichkhac/cauhoithuonggap';
import vanbanhuongdan from './tienichkhac/vanbanhuongdan';
import xemsau from './tienichkhac/xemsau';
import tientrinhhoctap from './tientrinhhoctap';
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
	...khaosat,
	...phanhoi,
	...thongbao,
	...cauhoithuonggap,
	...vanbanhuongdan,
	...xemsau,
};
