/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "@wordpress/element";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
/**
 * Adding spline import for adding spline 3d assets
 */

import Spline from "@splinetool/react-spline";
import { Icon, trash, copy, edit } from "@wordpress/icons";
import moveToCurrentAnimation from "./components/utils/moveToCurrentAnimation";
import duplicateAnimation from "./components/utils/duplicateAnimation";
import deleteAnimation from "./components/utils/deleteAnimation";
import playCurrent from "./components/utils/playCurrent";
import addAnimationItem from "./components/utils/addAnimationItem";
gsap.registerPlugin(ScrollTrigger);
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
import {
	TextControl,
	Button,
	Panel,
	SelectControl,
	PanelBody,
	ToggleControl,
	PanelRow,
	__experimentalDivider as Divider,
	TabPanel,
	ButtonGroup,
	Modal,
	CheckboxControl,
	RadioControl,
	__experimentalHStack as HStack,
} from "@wordpress/components";
import Animation from "./components/Animation";
export default function Edit({ attributes, setAttributes, className }) {
	const [currentAnimationItem, setCurrentAnimationItem] = useState("");
	const [scrolledValue, setScrolledValue] = useState({
		value: "",
		enabled: false,
	});
	const [currentAnimationTarget, setCurrentAnimationTarget] = useState({
		id: "",
		target: "",
		modal: false,
		start: "bottom",
		end: "bottom",
		awModal: false,
		awId: "",
	});
	const animationTarget = useRef("");
	const [previewAnimation, setPreviewAnimation] = useState(false);

	const [randomID, setRandomID] = useState("");
	const [splineUrlV, setSplineUrlV] = useState("");
	const splineProps = useRef("");
	const [panelToggle, setPanelToggle] = useState(false);
	const { animations, splineAnimations, splineUrl, customStyles } = attributes;
	const cube = useRef(null);
	function onLoad(spline) {
		// fetch all spline object layers
		splineProps.current = spline;
		animations.map((animation) => {
			const {
				objectLayer,
				animation: {
					animationProperies: { x, y, z },
				},
			} = animation;
			const obj = spline.findObjectByName(objectLayer);
			cube.current = obj;
		});

		// splineProps.current && moveToCurrentAnimation(currentAnimationItem);

		splineProps.current &&
			previewAnimation &&
			playCurrent(
				splineAnimations,
				splineContainer,
				splineProps,
				editorWrapper,
				previewAnimation,
				setCurrentAnimationItem,
			);
	}
	const [loadSpline, setLoadSpline] = useState(0);
	const [currentAnimationProps, setCurrentAnimationProps] = useState({
		id: "",
		obj: "",
		layer: "",
	});
	const [customEditorStyles, setCustomeEditorStyles] = useState({
		position: "",
		"z-index": "",
		height: "",
		width: "",
		left: "",
		right: "",
		top: "",
		"max-width": "100%",
		"pointer-events": "none",
		transform: "",
		"margin-top": "",
		"margin-bottom": "",
		opacity: 1,
	});
	const currentAnimation = (id, obj, layer, property) => {
		setCurrentAnimationProps({ id, obj, layer, property });
	};
	useEffect(() => {
		if (ScrollTrigger.getAll("scrolledValue").length > 1) {
			ScrollTrigger.getAll("scrolledValue").forEach((trigger) => {
				trigger.kill();
			});
		}
		ScrollTrigger.create({
			id: "scrolledValue",
			trigger: currentAnimationTarget.target,
			scroller: editorWrapper,
			start: `0% ${
				currentAnimationTarget.start ? currentAnimationTarget.start : "bottom"
			}`,
			end: `${
				currentAnimationTarget.start == "bottom" ? "100% bottom" : "100%"
			}`,
			onEnter: () => {
				setScrolledValue((prev) => ({
					...prev,
					enabled: true,
				}));
			},
			onLeave: () => {},
			onLeaveBack: () => {},
			onUpdate: (self) => {
				setScrolledValue((prev) => ({
					...prev,
					value: scrolledValue.enabled ? (self.progress * 100).toFixed() : 0,
				}));
			},
			onComplete: () => {
				setScrolledValue((prev) => ({
					...prev,
					enabled: false,
				}));
			},
		});
		if (previewAnimation) {
			// resetScene();

			setPreviewAnimation(false);
		}
	}, [currentAnimationTarget]);
	useEffect(() => {
		resetScene();
		if (splineProps.current && previewAnimation) {
			playCurrent(
				splineAnimations,
				splineContainer,
				splineProps,
				editorWrapper,
				previewAnimation,
				setCurrentAnimationItem,
			);
		}
	}, [previewAnimation]);
	useEffect(() => {
		attributes.splineAnimations?.siw?.map((siwItem) => {
			siwItem.animations.map((animation) => {
				const { id } = animation;
				const {
					obj: { position, rotation, scale },
				} = currentAnimationProps;
				if (id == currentAnimationProps.id && currentAnimationProps.layer) {
					const obj = splineProps.current.findObjectByName(
						currentAnimationProps.layer,
					);
					position && gsap.to(obj?.position, { ...position });
					rotation &&
						gsap.to(obj?.rotation, {
							...rotation,
						});
					scale &&
						gsap.to(obj?.scale, {
							...scale,
						});
				}
			});
		});
		if (previewAnimation) {
			resetScene();

			setPreviewAnimation(false);
		}
	}, [currentAnimationProps.obj]);
	useEffect(() => {
		setTimeout(() => {
			setLoadSpline(1);
		}, 2500);

		if (splineUrl !== "") {
			setSplineUrlV(splineUrl);
		}
		if (customStyles) {
			setCustomeEditorStyles((prevStyles) => ({
				...prevStyles, // Preserve the previous state
				...customStyles,
				// Update with the new styles
			}));
		}
	}, []);

	useEffect(() => {
		if (customStyles) {
			setCustomeEditorStyles((prevStyles) => ({
				...prevStyles, // Preserve the previous state
				...customStyles,
				// Update with the new styles
			}));
		}
	}, [customStyles]);
	const customStyleKeys = Object.keys(customEditorStyles);
	const deleteAnimationWrapper = (id) => {
		setAttributes({
			splineAnimations: {
				siw: splineAnimations.siw.filter((item) => item.id !== id),
			},
		});
	};

	// fetch spline container for edit mode previewing
	const splineContainer = useRef("");
	const resetScene = () => {
		setRandomID(Math.random() * 2);
	};
	const blockProps = useBlockProps();
	useEffect(() => {}, [blockProps]);
	const setResponsiveSettings = (value, name) => {
		setAttributes({ [name]: value });
	};
	useEffect(() => {
		const splineContainerStyles = splineContainer.current.getAttribute("style"); // set above styles to edit mode wrapper of splineContainer
		splineContainer.current
			.closest(".block-editor-block-list__block.wp-block")
			.setAttribute("style", splineContainerStyles);
	}),
		[];
	const [openAnimationModal, setOpenAnimationModal] = useState(false);
	const editorWrapper = document.querySelector(
		".interface-navigable-region.interface-interface-skeleton__content",
	);
	return (
		<div
			className={`akdev-spline-animation ${className} ${
				attributes.responsiveSettings
					? `${attributes.desktopHidden && "desktopHidden"}
					  ${attributes.tabletHidden && "tabletHidden"} 
					  ${attributes.mobileHidden && "mobileHidden"}`
					: ""
			}`}
			style={customEditorStyles}
			ref={splineContainer}
		>
			<InspectorControls key={"setting"}>
				<div style={{ padding: "15px", borderTop: "1px solid #ddd" }}>
					<TextControl
						placeholder="Enter spline url"
						label="Spline url"
						value={splineUrlV}
						style={{ padding: "10px" }}
						onChange={(val) => {
							setSplineUrlV(val);
							setAttributes({
								splineUrl: val,
							});
						}}
					/>
				</div>
				<div
					className="spline-animation-editor"
					style={{
						borderTop: "1px solid #ccc",
					}}
				>
					<Panel>
						<PanelBody title="Custom Styles" initialOpen={false}>
							<PanelRow>
								<div className="custom-styles" style={{ width: "100%" }}>
									{customStyleKeys &&
										customStyleKeys.map((style) => {
											return (
												<>
													<Panel className="spline-animation-editor">
														<PanelBody
															title={style}
															initialOpen={false}
															className="spline-animation-panel-body"
														>
															<PanelRow>
																<div
																	style={{
																		marginTop: "15px",
																		marginBottom: "15px",
																		width: "100%",
																		display: "flex",
																		flexFlow: "column",
																	}}
																>
																	<TextControl
																		placeholder={style}
																		value={customEditorStyles[style]}
																		onChange={(val) => {
																			// setCustomeEditorStyles((prev) => ({
																			// 	...prev,
																			// 	[style]: val,
																			// }));
																			setAttributes({
																				customStyles: {
																					...customEditorStyles,
																					[style]: val,
																				},
																			});
																		}}
																	/>
																</div>
															</PanelRow>
														</PanelBody>
													</Panel>
												</>
											);
										})}
								</div>
							</PanelRow>
						</PanelBody>
					</Panel>
					{/* tabs for type of animations */}
					<TabPanel
						onSelect={(e) => {}}
						tabs={[
							{
								name: "scrollingInView",
								title: "Scrolling in view",
							},
						]}
					>
						{(tab) => (
							<div
								style={{
									alignItems: "center",
									justifyContent: "center",
									padding: "10px 15px",
								}}
							>
								{tab.name == "scrollingInView" && (
									<>
										{attributes.splineAnimations.siw &&
											attributes.splineAnimations.siw.map((animation) => {
												return (
													<Panel className="spline-animation-editor">
														<PanelBody
															title={animation.target}
															initialOpen={false}
															opened={panelToggle}
															className="spline-animation-panel-body "
															onToggle={(e) => {
																e
																	? setPanelToggle(true)
																	: setPanelToggle(false);

																e &&
																	setCurrentAnimationTarget((prev) => ({
																		...prev,
																		id: animation.id,
																		start: animation.start,
																		end: animation.end,
																		target: animation.target,
																		// modal: true,
																	}));
															}}
														>
															<PanelRow>
																<div
																	style={{ paddingTop: "25px", width: "100%" }}
																>
																	{attributes?.splineAnimations?.siw?.map(
																		(siwItem) => {
																			if (animation.id == siwItem.id) {
																				{
																					return siwItem?.animations?.map(
																						(item, index) => {
																							return (
																								<div
																									key={index}
																									style={{
																										display: "flex",
																										marginBottom: "10px",
																										alignItems: "center",
																										justifyContent:
																											"space-between",
																										width: "100%",
																									}}
																								>
																									<RadioControl
																										options={[
																											{
																												label:
																													item?.animeName + "%",
																												value: item?.id,
																											},
																										]}
																										onChange={(val) => {
																											// current animation
																											previewAnimation ==
																												false &&
																												moveToCurrentAnimation(
																													splineAnimations,
																													splineProps,
																													index,
																												);
																											setCurrentAnimationItem(
																												item.id,
																											);
																											if (previewAnimation) {
																												setPreviewAnimation(
																													false,
																												);
																												setTimeout(() => {
																													moveToCurrentAnimation(
																														splineAnimations,
																														splineProps,
																														index,
																													);
																													setCurrentAnimationItem(
																														item.id,
																													);
																												}, 500);
																											}
																										}}
																										selected={
																											currentAnimationItem
																												? currentAnimationItem
																												: setCurrentAnimationItem(
																														siwItem
																															.animations[0]
																															?.id,
																												  )
																										}
																										className="flex flex-row"
																									/>
																									<ButtonGroup frameBorder={0}>
																										<Button
																											style={{
																												boxShadow:
																													"none !important",
																											}}
																											className="no-shadow px-4"
																											variant="tertiary"
																											onClick={() =>
																												deleteAnimation(
																													item.id,
																													splineAnimations,
																													setAttributes,
																													animations,
																												)
																											}
																										>
																											<Icon icon={trash} />
																										</Button>
																										<Button
																											variant="tertiary"
																											className="no-shadow px-4"
																											onClick={() =>
																												duplicateAnimation(
																													animation.id,
																													item.id,
																													splineAnimations,
																													attributes,
																													setAttributes,
																												)
																											}
																										>
																											<Icon icon={copy} />
																										</Button>
																									</ButtonGroup>
																								</div>
																							);
																						},
																					);
																				}
																			}
																		},
																	)}
																	<div
																		style={{
																			display: "flex",
																			flexDirection: "column",
																		}}
																	></div>
																	<div style={{ display: "flex", gap: "6px" }}>
																		<Button
																			style={{
																				width: "100%",
																				justifyContent: "center",
																			}}
																			variant="primary"
																			onClick={() => {
																				// Function to add a new JSON object to the animations array
																				addAnimationItem(
																					attributes,
																					setAttributes,
																					animation,
																					scrolledValue,
																					splineAnimations,
																				);
																			}}
																		>
																			Add animation
																		</Button>
																		<TextControl
																			type="number"
																			max={100}
																			min={0}
																			className="hide-spin-arrows"
																			__next40pxDefaultSize={true}
																			style={{ height: "100%", width: "40px" }}
																			value={scrolledValue.value}
																			onChange={(val) =>
																				setScrolledValue((prev) => ({
																					...prev,
																					value: val,
																				}))
																			}
																		/>
																	</div>
																	<ButtonGroup
																		frameBorder={0}
																		style={{
																			display: "flex",
																			paddingTop: "15px",
																		}}
																	>
																		<Button
																			variant="tertiary"
																			onClick={() => {
																				setCurrentAnimationTarget((prev) => ({
																					...prev,
																					modal: true,
																				}));
																			}}
																		>
																			Change settings
																		</Button>
																		<Button
																			style={{
																				boxShadow: "none !important",
																			}}
																			className="no-shadow px-4"
																			variant="tertiary"
																			onClick={() =>
																				setCurrentAnimationTarget((prev) => ({
																					...prev,
																					awModal: true,
																					awId: animation.id,
																				}))
																			}
																		>
																			<Icon icon={trash} />
																		</Button>
																	</ButtonGroup>
																	<div
																		style={{
																			padding:
																				animation?.animations?.length > 0 &&
																				"16px",
																		}}
																	>
																		{animation?.animations?.length > 0 && (
																			<CheckboxControl
																				label="Preview animation"
																				checked={previewAnimation}
																				onChange={(e) => {
																					e
																						? setPreviewAnimation(true)
																						: setPreviewAnimation(false);
																				}}
																			/>
																		)}
																	</div>
																</div>
															</PanelRow>
														</PanelBody>
													</Panel>
												);
											})}
										<Button
											variant="primary"
											style={{ marginTop: "10px" }}
											onClick={() => setOpenAnimationModal(true)}
										>
											Create scrolling animation
										</Button>
									</>
								)}
								{tab.name == "scrollintoView" && "world"}
							</div>
						)}
					</TabPanel>
					{/* open modal to add new animation */}
					{openAnimationModal && (
						<Modal
							title="Animations type"
							style={{ padding: 0 }}
							onRequestClose={() => {
								setOpenAnimationModal(false);
							}}
						>
							<div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
								<HStack spacing="3" style={{ flexDirection: "row" }}>
									<TextControl
										label="Target Class or ID"
										ref={animationTarget}
										onChange={() => {}}
									/>
								</HStack>
								<SelectControl
									label="0%"
									onChange={(val) => {
										setCurrentAnimationTarget((prev) => ({
											...prev,
											start: val,
										}));
									}}
									value={
										currentAnimationTarget.start
											? currentAnimationTarget.start
											: "bottom"
									}
								>
									<option value={"bottom"}> Starts Entering</option>
									<option value={"top"}> Fully Visible</option>
								</SelectControl>

								<Button
									variant="primary"
									style={{ textAlign: "center", justifyContent: "center" }}
									onClick={() => {
										setAttributes({
											splineAnimations: {
												siw: [
													...(splineAnimations.siw || []),
													{
														target: animationTarget.current.value,
														id: Math.random() * 10 + 1 + animations.length + 1,
														start: currentAnimationTarget.start,
														end: currentAnimationTarget.end,
														animations: [],
													},
												],
											},
										});
										setOpenAnimationModal(false);
									}}
								>
									Add animation
								</Button>
							</div>
						</Modal>
					)}
					{/* open modal to add new animation */}

					{/* open modal to confirm animation wrapper deletion */}
					{currentAnimationTarget.awModal && (
						<Modal
							title="Confirm animation deletion"
							style={{ padding: 0 }}
							onRequestClose={() => {
								setCurrentAnimationTarget((prev) => ({
									...prev, // Preserve the previous state
									awModal: false,
								}));
							}}
						>
							<div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
								<ButtonGroup style={{ display: "flex", gap: "15px" }}>
									<Button
										variant="primary"
										style={{ textAlign: "center", justifyContent: "center" }}
										onClick={() => {
											deleteAnimationWrapper(currentAnimationTarget.awId);
											setCurrentAnimationTarget((prev) => ({
												...prev,
												awModal: false,
												awId: "",
											}));
										}}
									>
										Delete animation
									</Button>
									<Button
										variant="tertiary"
										onClick={() => {
											setCurrentAnimationTarget((prev) => ({
												...prev,
												awModal: false,
												awId: "",
											}));
										}}
										style={{ boxShadow: "none !important" }}
									>
										Close
									</Button>
								</ButtonGroup>
							</div>
						</Modal>
					)}
					{/* open modal to add new animation */}

					{/* open modal to update  animation target */}
					{currentAnimationTarget.modal && (
						<Modal
							title="Animations type"
							style={{ padding: 0 }}
							onRequestClose={() => {
								setCurrentAnimationTarget((prev) => ({
									...prev, // Preserve the previous state
									modal: false,
								}));
							}}
						>
							<div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
								<HStack spacing="3" style={{ flexDirection: "row" }}>
									<TextControl
										label="Target Class or ID"
										ref={animationTarget}
										value={currentAnimationTarget.target}
										onChange={(val) => {
											setCurrentAnimationTarget((prev) => ({
												...prev,
												target: val,
											}));
										}}
									/>
								</HStack>

								<SelectControl
									label="0%"
									onChange={(val) => {
										setCurrentAnimationTarget((prev) => ({
											...prev,
											start: val,
										}));
									}}
									value={
										currentAnimationTarget.start
											? currentAnimationTarget.start
											: "bottom"
									}
								>
									<option value={"bottom"}> Starts Entering</option>
									<option value={"top"}> Fully Visible</option>
								</SelectControl>
								<Button
									variant="primary"
									style={{ textAlign: "center", justifyContent: "center" }}
									onClick={() => {
										const newSiwAnimations = splineAnimations.siw.map(
											(siwItem) => {
												// Check if the siwItem has the same id as the one you want to update
												if (siwItem.id === currentAnimationTarget.id) {
													// Update the target property to 'world' and retain all other properties
													const updatedAnimation = {
														...siwItem,
														target: currentAnimationTarget.target,
														start: currentAnimationTarget.start,
														end: currentAnimationTarget.end,
													};
													return updatedAnimation;
												}
												return siwItem;
											},
										);
										setAttributes({
											splineAnimations: {
												siw: newSiwAnimations,
											},
										});
										setCurrentAnimationTarget((prev) => ({
											...prev,
											modal: false,
										}));
									}}
								>
									Update animation
								</Button>
							</div>
						</Modal>
					)}
					{/* open modal to add new animation */}
					<div style={{ position: "relative" }}>
						{attributes.splineAnimations.siw &&
							attributes.splineAnimations?.siw?.map((siwItem) => {
								{
									return siwItem?.animations
										.sort((a, b) => {
											const animeNameA =
												typeof a.animeName === "string"
													? parseInt(a.animeName)
													: a.animeName;
											const animeNameB =
												typeof b.animeName === "string"
													? parseInt(b.animeName)
													: b.animeName;

											return animeNameA - animeNameB;
										})
										?.map((animation) => {
											if (currentAnimationItem == animation.id) {
												return (
													<Animation
														splineContainer={splineContainer}
														resetScene={resetScene}
														key={animation.id}
														testParent={siwItem.id}
														currentAnimation={currentAnimation}
														deleteAnimation={deleteAnimation}
														animation={animation}
														spline={splineProps}
														attributes={attributes}
														setAttributes={setAttributes}
													/>
												);
											}
										});
								}
							})}
					</div>

					<div style={{}}>
						<Button
							variant="tertiary"
							onClick={resetScene}
							style={{
								marginTop: "5px",
								display: "flex",
								justifyContent: "center",
								width: "100%",
							}}
						>
							Reset Scene
						</Button>
					</div>

					<div style={{ borderTop: "1px solid #ddd" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "15px 25px",
							}}
						>
							<ToggleControl
								label="Responsive settings"
								checked={attributes.responsiveSettings}
								onChange={(val) => setAttributes({ responsiveSettings: val })}
							/>
						</div>
						{attributes.responsiveSettings && (
							<TabPanel
								onSelect={(e) => {}}
								tabs={[
									{
										name: "desktopHidden",
										icon: "desktop",
										title: "Desktop",
									},
									{
										icon: "tablet",
										name: "tabletHidden",
										title: "Tablet",
									},
									{
										icon: "smartphone",
										name: "mobileHidden",
										title: "Mobile",
									},
								]}
							>
								{(tab) => (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "15px 25px",
										}}
									>
										{" "}
										<ToggleControl
											label={`Hide on ${tab.title}`}
											checked={attributes[tab.name]}
											onChange={(e) => setResponsiveSettings(e, tab.name)}
										/>
									</div>
								)}
							</TabPanel>
						)}
					</div>
				</div>
			</InspectorControls>
			<div>
				<Spline
					key={randomID}
					style={{
						position: "sticky",
						height: "100vh",
						top: "50px",
						width: "100%",
					}}
					onLoad={onLoad}
					scene={
						splineUrlV
							? splineUrlV
							: "https://prod.spline.design/a8HDk7NyVYzsL0TP/scene.splinecode"
					}
				/>
			</div>
		</div>
	);
}
