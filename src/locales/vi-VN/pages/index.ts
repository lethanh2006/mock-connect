import donvihanhchinh from './donvihanhchinh';
import login from './login';
import thongtincanhan from './thongtincanhan';
import trangchu from './trangchu';

export default {
	...login,
	...trangchu,
	...thongtincanhan,
	...donvihanhchinh,
};
