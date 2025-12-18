import donvihanhchinh from './donvihanhchinh';
import lichsukien from './lichsukien';
import login from './login';
import thongtincanhan from './thongtincanhan';
import trangchu from './trangchu';

export default {
	...login,
	...trangchu,
	...thongtincanhan,
	...donvihanhchinh,
	...lichsukien,
};
