import { useEffect, useState, useRef } from 'react';
import { getDaysNameArray } from './helper';
import { getFormatDate } from './helper';
const DaysNameWheel = (props: any) => {
	const itemHeight = props.itemHeight || 40;
	const [currentDate, setCurrentDate] = useState(props.currentDate);

	const viewItems = props.viewItems || 3;
	const onDaysNameChange = props.onDaysNameChange || null;

	const getItemIndexTranslate = () => {
		return Math.round(curentTranslateY / itemHeight) * -1 + itemsView;
	};

	const getCurrentItemValue = () => {
		return items[indexTranslate - indexMarginTop].value;
	};

	const getItemsArray = (curentElelemt: any) => {
		return getDaysNameArray(curentElelemt);
	};

	const itemsView = viewItems % 2 === 0 ? viewItems / 2 : (viewItems - 1) / 2;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const isDraging = useRef(false);
	const startY = useRef(0);
	const [items, setItems] = useState(getItemsArray(getFormatDate(currentDate)));
	const [curentTranslateY, setCurentTranslateY] = useState((items.length / 2 - itemsView) * -itemHeight);
	const [marginTop, setMarginTop] = useState(0);
	const [indexTranslate, setIndexTranslate] = useState(getItemIndexTranslate());
	const [indexMarginTop, setIndexMarginTop] = useState(0);
	const [index, setIndex] = useState(indexTranslate);

	useEffect(() => {
		setMarginTop(indexMarginTop * itemHeight);
		if (onDaysNameChange) onDaysNameChange(getCurrentItemValue());
	}, [indexMarginTop]);

	useEffect(() => {
		setItems(getItemsArray(getCurrentItemValue()));
		setIndexMarginTop(indexTranslate - index);
	}, [indexTranslate]);

	useEffect(() => {
		setIndexTranslate(getItemIndexTranslate());
	}, [curentTranslateY]);

	const handleMouseDown = (e: any) => {
		isDraging.current = true;
		startY.current = e.clientY;
		if (wrapperRef.current) wrapperRef.current.style.transition = 'transform 0s ease-out';
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};
	const handleMouseMove = (e: any) => {
		if (!isDraging.current) return;

		const diff = e.clientY - startY.current;
		setCurentTranslateY((prev) => prev + diff);
		startY.current = e.clientY;
	};
	const handleMouseUp = (e: any) => {
		isDraging.current = false;
		setCurentTranslateY((prev) => Math.round(prev / itemHeight) * itemHeight);
		if (wrapperRef.current) wrapperRef.current.style.transition = 'transform 0.5s ease-out';
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	// Touch Events
	const handleTouchStart = (e: any) => {
		isDraging.current = true;
		startY.current = e.touches[0].clientY;
		if (wrapperRef.current) wrapperRef.current.style.transition = 'transform 0s ease-out';
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('touchend', handleTouchEnd);
	};

	const handleTouchMove = (e: any) => {
		if (!isDraging.current) return;
		if (e.cancelable && typeof e.preventDefault === 'function') {
			e.preventDefault(); // Prevent default scrolling behavior if possible
		}
		const diff = e.touches[0].clientY - startY.current;
		setCurentTranslateY((prev) => prev + diff);
		startY.current = e.touches[0].clientY;
	};

	const handleTouchEnd = () => {
		isDraging.current = false;
		setCurentTranslateY((prev) => Math.round(prev / itemHeight) * itemHeight);
		if (wrapperRef.current) wrapperRef.current.style.transition = 'transform 0.5s ease-out';
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	};

	const handleOnWheel = (e: any) => {
		e.preventDefault();
		if (e.deltaY < 0) {
			setCurentTranslateY((prev) => prev + itemHeight);
		} else {
			setCurentTranslateY((prev) => prev - itemHeight);
		}
	};

	const handleClick = (ind: number) => {
		const indaxDiff = index - ind;
		setCurentTranslateY((prev) => prev + indaxDiff * itemHeight);
	};

	useEffect(() => {
		wrapperRef.current?.addEventListener('wheel', handleOnWheel, { passive: false });
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, []);

	return (
		<div className="picker-wheel">
			<div className="picker-wheel-middel-line" style={{ height: itemHeight + 'px' }}></div>
			<div
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				ref={wrapperRef}
				className="picker-wheel-items"
				style={{ transform: 'translateY(' + curentTranslateY + 'px)', marginTop: marginTop + 'px' }}
			>
				{items.map((item, index) => (
					<div onClick={() => handleClick(index)} key={index} className="picker-wheel-item" style={{ height: itemHeight + 'px' }}>
						<div className={`picker-wheel-item-inner ${item.isSelected ? 'active' : ''}`}>{item.text}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DaysNameWheel;
