import { getTechAbr } from '../../helpers/helper';
import IconTrashLines from '../Icon/IconTrashLines';
import { SmallDangerLoader } from '../loading/SmallCirculeLoader';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
interface TechItemProps {
	key: number;
	className: string;
	color: string;
	id: number;
	name: string;
	phone: string;
	roles: any;
	addRemovetechFromList?: (id:number) => void;
	removeTechHandle?: (id: number) => void;
	removeTechStatus: number;
}
const TechItem = (props: TechItemProps) => {
   const rolesTitle = useSelector((state: IRootState) => state.themeConfig.rolesTitle);
	const rolesColor = useSelector((state: IRootState) => state.themeConfig.rolesColor);
	return (
		<li key={props.key} className={props.className} onClick={()=> props.addRemovetechFromList && props.addRemovetechFromList(props.id)}>
			<div className="mr-2">
				<span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white"} style={{ backgroundColor: props.color }}>
					{getTechAbr(props.name)}
				</span>
			</div>
			<div className="ml-4 w-full ">
				<div className="flex items-center justify-between">
					<p className="font-semibold">{props.name}</p>
					<div className="mr-4">
						{props.roles.map((role: any, roleIndex: number) => (
							<span key={roleIndex} className={`badge badge-outline-${rolesColor[role.role]} ml-2`}>
								{rolesTitle[role.role]}
							</span>
						))}
					</div>
				</div>
				<p className="font-semibold">{props.phone}</p>
			</div>
			{props.removeTechStatus !== -1 && (
				<div className="">
					{props.removeTechStatus === props.id ? (
                  <SmallDangerLoader/>
					) : (
						<button type="button" onClick={() => props.removeTechHandle && props.removeTechHandle(props.id)}>
							<IconTrashLines />
						</button>
					)}
				</div>
			)}
		</li>
	);
};

export default TechItem;
