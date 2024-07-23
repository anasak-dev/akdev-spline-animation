import {
	TextControl,
	SelectControl,
	ToggleControl,
	CheckboxControl,
	__experimentalDivider as Divider,
} from "@wordpress/components";
gsap.registerPlugin(ScrollTrigger);
import { useState, useEffect } from "@wordpress/element";
import { CustomRangeController } from "./CustomRangeController";
import extractNestedChildren from "./utils/ExtractNestedChildren";

const Animation = ({
	animation,
	spline,
	currentAnimation,
	attributes,
	setAttributes,
}) => {
	const {
		type,
		animation: { objectLayer },
		animation: { animationProperies },
		animeName,
	} = animation;
	const [propertyTypeV, setPropertyTypeV] = useState("");
	const [objectLayerV, setObjectLayerV] = useState("");
	const [animeLoopV, setAnimeLoopV] = useState("");
	const [tempLayer, setTempLayer] = useState([]);
	const [animationProperty, setAnimationProperty] = useState({
		position: { x: "", y: "", z: "" },
		rotation: { x: "", y: "", z: "" },
		scale: { x: "", y: "", z: "" },
	});
	const positionProps =
		animationProperty.position && Object.entries(animationProperty.position);
	const rotationProps =
		animationProperty.rotation && Object.entries(animationProperty.rotation);
	const scaleProps =
		animationProperty.scale && Object.entries(animationProperty.scale);
	// scroll out animation
	const [soanimationProperty, sosetAnimationProperty] = useState({
		position: { x: "", y: "", z: "" },
		rotation: { x: "", y: "", z: "" },
		scale: { x: "", y: "", z: "" },
	});
	const sopositionProps =
		soanimationProperty.position &&
		Object.entries(soanimationProperty.position);
	const sorotationProps =
		soanimationProperty.rotation &&
		Object.entries(soanimationProperty.rotation);
	const soscaleProps =
		soanimationProperty.scale && Object.entries(soanimationProperty.scale);
	// scroll out animation

	// Get an array of property names

	const [fromToProps, setFromtoProps] = useState({
		from: { x: "", y: "", z: "" },
		to: { x: "", y: "", z: "" },
	});
	const fromProps = fromToProps?.from && Object.entries(fromToProps.from);
	const toProps = fromToProps?.to && Object.entries(fromToProps.to);
	const nestedChildrenArray = extractNestedChildren(
		spline.current?._data?.scene?.objects[0].children,
	);

	const animationPropertyResetFunc = (key) => {
		setAnimationProperty((prev) => {
			return {
				...prev,
				[key]: "",
			};
		});
	};
	useEffect(() => {
		if (animation.animation?.scrollOut?.animationProperies != "") {
			if (animation.animation?.scrollOut?.animationProperies !== undefined) {
				const positions =
					animation.animation?.scrollOut?.animationProperies.position;
				const rotations =
					animation.animation?.scrollOut?.animationProperies.rotation;
				const scales = animation.animation?.scrollOut?.animationProperies.scale;
				sosetAnimationProperty((prev) => ({
					position: {
						...prev.position,
						...positions,
					},
					rotation: {
						...prev.rotation,
						...rotations,
					},
					scale: {
						...prev.scale,
						...scales,
					},
				}));
			}
		}
		// fetch all layers of the 3d object
		const data = [];
		nestedChildrenArray?.map((item) => {
			item.map((i) => {
				data.push(i.data.name);
			});
		});

		const topLevelLayers = spline.current?._data?.scene?.objects[0].children
			.map(
				(layers) =>
					// layers.children.length > 0 &&
					layers.data.name != false && layers.data.name,
			)
			.filter((item) => item != false);

		Array.isArray(data) &&
			topLevelLayers?.forEach((layer) => {
				data.unshift(layer);
			});
		Array.isArray(data) && data.unshift("Select Object");
		setTempLayer(data);
		// fetch all layers of the 3d object
	}, []);
	useEffect(() => {
		if (animationProperies != "") {
			if (animationProperies !== undefined) {
				setAnimationProperty((prev) => ({
					position: { ...prev.position, ...animationProperies.position },
					rotation: { ...prev.rotation, ...animationProperies.rotation },
					scale: { ...prev.scale, ...animationProperies.scale },
				}));
				setFromtoProps(animationProperies);
			}
		}
	}, [tempLayer]);
	return (
		<>
			<div
				style={{
					marginTop: "15px",
					marginBottom: "15px",
					width: "100%",
					display: "flex",
					padding: "20px 15px",
					flexFlow: "column",
					backgroundColor: "#f5f5f5",
				}}
			>
				<div
					style={{
						display: "flex",
						flexFlow: "column",
					}}
				>
					<div
						style={{
							paddingBottom: "10px",
						}}
					>
						<label
							style={{
								display: "block",
								paddingBottom: "10px",
								fontWeight: "600",
								fontSize: "14px",
							}}
						>
							Object Layer
						</label>
						<SelectControl
							style={{ minHeight: "40px" }}
							onChange={(val) => {
								const currentSiw = [...attributes.splineAnimations.siw];

								// Find the siw object with the specified id
								const siwToUpdate = currentSiw.find((siw) => siw.id);
								if (siwToUpdate) {
									// Find the animation object within the siw object
									const animationToUpdate = siwToUpdate.animations.find(
										(anime) => anime.id === animation.id,
									);
									if (animationToUpdate) {
										// Update the animeName property of the animation object
										animationToUpdate.animation.objectLayer = val;
										// Update the siwArray with the updated siw object
										const updatedSiwArray = currentSiw.map((siw) =>
											siw.id === animation.id ? siwToUpdate : siw,
										);
										// Update the siwArray attribute in state or props
										setAttributes({
											splineAnimations: { siw: updatedSiwArray },
										});
									}
								}
							}}
							value={objectLayer}
						>
							{tempLayer &&
								tempLayer?.map((item) => {
									return <option value={item}>{item}</option>;
								})}
						</SelectControl>
					</div>
					<div style={{ display: "flex", gap: "10px", flexFlow: "column" }}>
						{type == "fromto" && (
							<>
								{" "}
								<CheckboxControl
									checked={animeLoopV ? true : false}
									label="Loop"
									onChange={(e) => {
										setAnimeLoopV(e);
									}}
								/>
								<Divider margin="2" />
							</>
						)}

						<div>
							{type == "fromto" && (
								<label
									style={{
										display: "block",
										paddingBottom: "10px",
										fontWeight: "bold",
										fontSize: "14px",
									}}
								>
									From
								</label>
							)}
							{type == "fromto" &&
								animationProperty &&
								fromProps.map(([key, value]) => {
									return (
										<>
											<CustomRangeController
												keyName={key}
												objectLayerV={objectLayerV}
												spline={spline}
												propertyType={propertyTypeV}
												animation={animation}
												valueName={value}
												animationPropertyResetFunc={(key) =>
													animationPropertyResetFunc(key)
												}
												currentAnimation={(
													id,
													animeObj,
													objlayer,
													propertylayer,
													val,
												) => {
													currentAnimation(
														id,
														animeObj,
														objlayer,
														propertylayer,
													);
													setFromtoProps((prev) => {
														return {
															...prev,
															from: {
																...prev.from,
																[key]: val == undefined ? "" : val,
															},
														};
													});
												}}
											/>
										</>
									);
								})}
							{type == "fromto" && (
								<label
									style={{
										display: "block",
										paddingBottom: "10px",
										fontWeight: "bold",
										fontSize: "14px",
									}}
								>
									{" "}
									To
								</label>
							)}
							{type == "fromto" &&
								animationProperty &&
								toProps.map(([key, value]) => {
									return (
										<>
											<CustomRangeController
												keyName={key}
												objectLayerV={objectLayerV}
												spline={spline}
												propertyType={propertyTypeV}
												animation={animation}
												valueName={value}
												animationPropertyResetFunc={(key) =>
													animationPropertyResetFunc(key)
												}
												currentAnimation={(
													id,
													animeObj,
													objlayer,
													propertylayer,
													val,
												) => {
													currentAnimation(
														id,
														animeObj,
														objlayer,
														propertylayer,
													);
													setFromtoProps((prev) => {
														return {
															...prev,
															to: {
																...prev.to,
																[key]: val == undefined ? "" : val,
															},
														};
													});
												}}
											/>
										</>
									);
								})}
							<label
								style={{
									display: "block",
									paddingBottom: "10px",
									fontWeight: "600",
									fontSize: "13px",
								}}
							>
								Position
							</label>
							{positionProps &&
								positionProps.map(([key, value]) => {
									return (
										<>
											<CustomRangeController
												keyName={key}
												objectLayerV={objectLayerV}
												spline={spline}
												newPropertyType={"position"}
												propertyType={propertyTypeV}
												animation={animation}
												valueName={value}
												animationPropertyResetFunc={(key) =>
													animationPropertyResetFunc(key)
												}
												currentAnimation={(
													id,
													animeObj,
													objlayer,
													propertylayer,
													val,
												) => {
													currentAnimation(
														id,
														animeObj,
														objlayer,
														propertylayer,
													);

													const currentSiw = [
														...attributes.splineAnimations.siw,
													];

													// Find the siw object with the specified id
													const siwToUpdate = currentSiw.find((siw) => siw.id);
													if (siwToUpdate) {
														// Find the animation object within the siw object
														const animationToUpdate =
															siwToUpdate.animations.find(
																(anime) => anime.id === animation.id,
															);
														if (
															animationToUpdate &&
															animationToUpdate.id == animation.id
														) {
															// Update the animeName property of the animation object

															animationToUpdate.animation.animationProperies = {
																...animationToUpdate.animation
																	.animationProperies,
																position: {
																	...animationToUpdate.animation
																		.animationProperies.position,
																	[key]: val,
																},
															};
															// Update the siwArray with the updated siw objecz
															currentSiw.map((siw) =>
																siw.animations.map((anim) => {}),
															);
															currentSiw.map((siw) =>
																siw.animations.map((anime) => {}),
															);
															const updatedSiwArray = currentSiw.map((siw) =>
																siw.animations.map((anime) => {
																	return anime.id === animation.id
																		? animationToUpdate
																		: anime;
																}),
															);
															// Update the siwArray attribute in state or props
															setAttributes({
																splineAnimations: {
																	siw: [
																		{
																			animations: updatedSiwArray[0],
																			id: siwToUpdate.id,
																			end: siwToUpdate.end,
																			start: siwToUpdate.start,
																			target: siwToUpdate.target,
																		},
																	],
																},
															});
														}
													}
												}}
											/>
										</>
									);
								})}
							<label
								style={{
									display: "block",
									paddingBottom: "10px",
									fontWeight: "600",
									fontSize: "13px",
								}}
							>
								Rotation
							</label>
							{rotationProps &&
								rotationProps.map(([key, value]) => {
									return (
										<>
											<CustomRangeController
												keyName={key}
												objectLayerV={objectLayerV}
												spline={spline}
												newPropertyType={"rotation"}
												propertyType={"rotation"}
												animation={animation}
												valueName={value}
												animationPropertyResetFunc={(key) =>
													animationPropertyResetFunc(key)
												}
												currentAnimation={(
													id,
													animeObj,
													objlayer,
													propertylayer,
													val,
												) => {
													currentAnimation(
														id,
														animeObj,
														objlayer,
														propertylayer,
													);

													const currentSiw = [
														...attributes.splineAnimations.siw,
													];

													// Find the siw object with the specified id
													const siwToUpdate = currentSiw.find((siw) => siw.id);
													if (siwToUpdate) {
														// Find the animation object within the siw object
														const animationToUpdate =
															siwToUpdate.animations.find(
																(anime) => anime.id === animation.id,
															);
														if (
															animationToUpdate &&
															animationToUpdate.id == animation.id
														) {
															// Update the animeName property of the animation object

															animationToUpdate.animation.animationProperies = {
																...animationToUpdate.animation
																	.animationProperies,
																rotation: {
																	...animationToUpdate.animation
																		.animationProperies.rotation,
																	[key]: val,
																},
															};
															// Update the siwArray with the updated siw objecz
															currentSiw.map((siw) =>
																siw.animations.map((anim) => {}),
															);

															const updatedSiwArray = currentSiw.map((siw) =>
																siw.animations.map((anime) => {
																	return anime.id === animation.id
																		? animationToUpdate
																		: anime;
																}),
															);

															// Update the siwArray attribute in state or props
															setAttributes({
																splineAnimations: {
																	siw: [
																		{
																			animations: updatedSiwArray[0],
																			id: siwToUpdate.id,
																			end: siwToUpdate.end,
																			start: siwToUpdate.start,
																			target: siwToUpdate.target,
																		},
																	],
																},
															});
														}
													}
												}}
											/>
										</>
									);
								})}
							<label
								style={{
									display: "block",
									paddingBottom: "10px",
									fontWeight: "600",
									fontSize: "13px",
								}}
							>
								Scale
							</label>
							{scaleProps &&
								scaleProps.map(([key, value]) => {
									return (
										<>
											<CustomRangeController
												keyName={key}
												newPropertyType={"scale"}
												objectLayerV={objectLayerV}
												spline={spline}
												propertyType={"scale"}
												animation={animation}
												valueName={value}
												animationPropertyResetFunc={(key) =>
													animationPropertyResetFunc(key)
												}
												currentAnimation={(
													id,
													animeObj,
													objlayer,
													propertylayer,
													val,
												) => {
													const newVal = val;
													currentAnimation(
														id,
														animeObj,
														objlayer,
														propertylayer,
													);

													const currentSiw = [
														...attributes.splineAnimations.siw,
													];

													// Find the siw object with the specified id
													const siwToUpdate = currentSiw.find((siw) => siw.id);
													if (siwToUpdate) {
														// Find the animation object within the siw object
														const animationToUpdate =
															siwToUpdate.animations.find(
																(anime) => anime.id === animation.id,
															);
														if (
															animationToUpdate &&
															animationToUpdate.id == animation.id
														) {
															animationToUpdate.animation.animationProperies = {
																...animationToUpdate.animation
																	.animationProperies,
																scale: {
																	...animationToUpdate.animation
																		.animationProperies.scale,
																	[key]: val,
																},
															};
															// Update the siwArray with the updated siw objecz
															currentSiw.map((siw) =>
																siw.animations.map((anim) => {}),
															);

															const updatedSiwArray = currentSiw.map((siw) =>
																siw.animations.map((anime) => {
																	return anime.id === animation.id
																		? animationToUpdate
																		: anime;
																}),
															);

															// Update the siwArray attribute in state or props
															setAttributes({
																splineAnimations: {
																	siw: [
																		{
																			animations: updatedSiwArray[0],
																			id: siwToUpdate.id,
																			end: siwToUpdate.end,
																			start: siwToUpdate.start,

																			target: siwToUpdate.target,
																		},
																	],
																},
															});
														}
													}
												}}
											/>
										</>
									);
								})}
							{animation.type == "siw" && (
								<>
									<ToggleControl
										label="Scroll out animation"
										checked={animation.scrollOutEnabled}
										onChange={(val) =>
											setAttributes({
												animations: attributes.animations.map((el) =>
													el.id == animation.id
														? {
																animeName: el.animeName,
																target: el.target,
																id: el.id,
																scrollOutEnabled: val,
																type: el.type,
																scrub: el.scrub,
																animeBoundaries: el.animeBoundaries,
																animation: {
																	...el.animation,
																},
														  }
														: el,
												),
											})
										}
									/>
									{animation.scrollOutEnabled && (
										<>
											<label
												style={{
													display: "block",
													paddingBottom: "10px",
													fontWeight: "bold",
													fontSize: "14px",
												}}
											>
												Position
											</label>
											{sopositionProps &&
												sopositionProps.map(([key, value]) => {
													return (
														<>
															<CustomRangeController
																keyName={key}
																objectLayerV={objectLayerV}
																spline={spline}
																newPropertyType={"position"}
																propertyType={propertyTypeV}
																animation={animation}
																valueName={value}
																animationPropertyResetFunc={(key) =>
																	animationPropertyResetFunc(key)
																}
																currentAnimation={(
																	id,
																	animeObj,
																	objlayer,
																	propertylayer,
																	val,
																) => {
																	currentAnimation(
																		id,
																		animeObj,
																		objlayer,
																		propertylayer,
																	);
																	attributes.animations.map((item) => {});
																}}
															/>
														</>
													);
												})}

											<label
												style={{
													display: "block",
													paddingBottom: "10px",
													fontWeight: "bold",
													fontSize: "14px",
												}}
											>
												Rotation
											</label>
											{sorotationProps &&
												sorotationProps.map(([key, value]) => {
													return (
														<>
															<CustomRangeController
																keyName={key}
																objectLayerV={objectLayerV}
																spline={spline}
																newPropertyType={"rotation"}
																propertyType={propertyTypeV}
																animation={animation}
																valueName={value}
																animationPropertyResetFunc={(key) =>
																	animationPropertyResetFunc(key)
																}
																currentAnimation={(
																	id,
																	animeObj,
																	objlayer,
																	propertylayer,
																	val,
																) => {
																	currentAnimation(
																		id,
																		animeObj,
																		objlayer,
																		propertylayer,
																	);

																	setAttributes({
																		animations: attributes.animations.map(
																			(el) =>
																				el.id == animation.id
																					? {
																							animeName: el.animeName,
																							target: el.target,
																							id: el.id,
																							type: el.type,
																							scrub: el.scrub,
																							scrollOutEnabled:
																								el.scrollOutEnabled,

																							animeBoundaries: {
																								end: el.animeBoundaries.end,
																								start: el.animeBoundaries.start,
																							},
																							animation: {
																								...el.animation,
																								scrollOut: {
																									animationProperies: {
																										...el.animation.scrollOut
																											.animationProperies,
																										rotation: {
																											...el.animation?.scrollOut
																												?.animationProperies
																												.rotation,

																											[key]:
																												val == undefined
																													? ""
																													: val,
																										},
																									},
																								},
																							},
																					  }
																					: el,
																		),
																	});
																}}
															/>
														</>
													);
												})}

											<label
												style={{
													display: "block",
													paddingBottom: "10px",
													fontWeight: "bold",
													fontSize: "14px",
												}}
											>
												Scale
											</label>
											{soscaleProps &&
												soscaleProps.map(([key, value]) => {
													return (
														<>
															<CustomRangeController
																keyName={key}
																objectLayerV={objectLayerV}
																spline={spline}
																newPropertyType={"scale"}
																propertyType={propertyTypeV}
																animation={animation}
																valueName={value}
																animationPropertyResetFunc={(key) =>
																	animationPropertyResetFunc(key)
																}
																currentAnimation={(
																	id,
																	animeObj,
																	objlayer,
																	propertylayer,
																	val,
																) => {
																	currentAnimation(
																		id,
																		animeObj,
																		objlayer,
																		propertylayer,
																	);
																	setAttributes({
																		animations: attributes.animations.map(
																			(el) =>
																				el.id == animation.id
																					? {
																							animeName: el.animeName,
																							target: el.target,
																							id: el.id,
																							type: el.type,
																							scrub: el.scrub,
																							scrollOutEnabled:
																								el.scrollOutEnabled,

																							animeBoundaries: {
																								end: el.animeBoundaries.end,
																								start: el.animeBoundaries.start,
																							},
																							animation: {
																								...el.animation,
																								scrollOut: {
																									animationProperies: {
																										...el.animation.scrollOut
																											.animationProperies,
																										scale: {
																											...el.animation?.scrollOut
																												?.animationProperies
																												.scale,
																											[key]:
																												val == undefined
																													? ""
																													: val,
																										},
																									},
																								},
																							},
																					  }
																					: el,
																		),
																	});
																}}
															/>
														</>
													);
												})}
										</>
									)}
								</>
							)}
						</div>
					</div>

					<div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
						<TextControl
							label={"Frame"}
							hel
							type="number"
							min={0}
							max={100}
							placeholder={`Animation start`}
							style={{
								paddingLeft: "10px",
								width: "100%",
								minHeight: "40px",
								fontSize: "12px",
								marginBottom: "0px",
							}}
							value={animeName}
							onChange={(val) => {
								const currentSiw = [...attributes.splineAnimations.siw];

								// Find the siw object with the specified id
								const siwToUpdate = currentSiw.find((siw) => siw.id);
								if (siwToUpdate) {
									// Find the animation object within the siw object
									const animationToUpdate = siwToUpdate.animations.find(
										(anime) => anime.id === animation.id,
									);
									if (animationToUpdate) {
										// Update the animeName property of the animation object
										animationToUpdate.animeName = val;
										// Update the siwArray with the updated siw object
										const updatedSiwArray = currentSiw.map((siw) =>
											siw.id === animation.id ? siwToUpdate : siw,
										);

										// Update the siwArray attribute in state or props
										setAttributes({
											splineAnimations: { siw: updatedSiwArray },
										});
									}
								}
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Animation;
