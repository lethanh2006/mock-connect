import donvihanhchinh from './donvihanhchinh';
import hoctapkhac from './hoctap/khac';
import lichsukien from './lichsukien';
import login from './login';
import lophanhchinh from './lophanhchinh';
import lophocphan from './lophocphan';
import thongtincanhan from './thongtincanhan';
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
};
