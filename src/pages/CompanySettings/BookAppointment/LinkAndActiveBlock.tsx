import { useState } from "react";
import IconCopy from "../../../components/Icon/IconCopy";

const LinkAndActiveBlock = (props:any) => {
   const [settings, setSettings] = useState<any>(props.settings);
   
	return (
		<div className="panel p-4">
			<div className="mb-5">
				
				<div className="flex">
					<input id="addonsRight" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none"  value={window.location.origin + '/appointment/book/' + settings.key}/>
					<button type="button" className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none">
						<IconCopy />
					</button>
				</div>
			</div>
		</div>
	);
};

export default LinkAndActiveBlock;
