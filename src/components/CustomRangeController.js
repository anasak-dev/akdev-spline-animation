import { RangeControl } from "@wordpress/components";
import { useState, useEffect, useRef } from "@wordpress/element";

export const CustomRangeController = ({
	keyName,
	propertyType,
	valueName,
	spline,
	animation,
	currentAnimation,
	objectLayerV,
	newPropertyType,
}) => {
	const rangeRef = useRef();
	const {
		animation: { animationProperies },
	} = animation;
	const [backupProp, setBackupProp] = useState("");
	const [currentValue, setCurrentValue] = useState();
	useEffect(() => {
		setCurrentValue(valueName);
	}, [valueName]);

	function extractBackupProps(data, layerName, axis) {
		let result = [];
		let resetValue;

		function recursiveExtract(array) {
			for (const item of array) {
				if (item.children && item.children.length > 0) {
					result.push(item.children);
					recursiveExtract(item.children);
				}
				if (item.data.name == layerName) {
					if (axis == "x") {
						resetValue = item.data?.[newPropertyType][0];

						setCurrentValue("");
					}
					if (axis == "y") {
						resetValue = item.data?.[newPropertyType][1];
						setCurrentValue("");
					}
					if (axis == "z") {
						resetValue = item.data?.[newPropertyType][2];
						setCurrentValue("");
					}
					return;
				}
			}
		}

		recursiveExtract(data);
		currentAnimation(
			animation.id,

			{
				[newPropertyType]: {
					[keyName]:
						[newPropertyType] == "rotation"
							? currentValue == 0
								? 0
								: ((currentValue - -360) * 12.6) / 720 - 6.3
							: resetValue,
				},
			},

			objectLayerV,
			propertyType,
			"",
		);
		return result;
	}
	const handleChange = (val) => {
		setCurrentValue(val);
		currentAnimation(
			animation.id,
			{ [newPropertyType]: { [keyName]: val } },
			animation.animation.objectLayer,
			propertyType,
			val,
		);
	};

	return (
		<div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
			<RangeControl
				className="animation-property"
				label={keyName}
				placeholder={0}
				ref={rangeRef}
				max={
					newPropertyType == "rotation"
						? 6.3
						: newPropertyType == "scale"
						? 10
						: 1500
				}
				min={
					newPropertyType == "rotation"
						? -6.3
						: newPropertyType == "scale"
						? -10
						: -1500
				}
				step={0.01}
				value={currentValue}
				onChange={(val) => {
					handleChange(val);
				}}
			/>
			<span
				style={{ pointerEvents: "all" }}
				onClick={() => {
					extractBackupProps(
						spline.current?._data?.scene?.objects[0].children,
						objectLayerV,
						keyName,
					);
				}}
				class="dashicons dashicons-undo"
			></span>
		</div>
	);
};
