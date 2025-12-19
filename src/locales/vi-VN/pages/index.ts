import donvihanhchinh from './donvihanhchinh';
import ketquahoctap from './ketquahoctap';
import lichsukien from './lichsukien';
import login from './login';
import lophanhchinh from './lophanhchinh';
import lophocphan from './lophocphan';
import thongtincanhan from './thongtincanhan';
import tientrinhhoctap from './tientrinhhoctap';
import trangchu from './trangchu';

export default {
	...login,
	...trangchu,
	...thongtincanhan,
	...donvihanhchinh,
	...lichsukien,
	...lophanhchinh,
	...lophocphan,
	...tientrinhhoctap,
	...ketquahoctap,
};
