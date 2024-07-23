import { render, useEffect, useRef } from "@wordpress/element";
import Spline from "@splinetool/react-spline";
// import gsap, { wrap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);
export default function Client(attributes) {
	const splineContainer = useRef();
	const cube = useRef(null);
	const splineProps = useRef("");
	const parseJSON = JSON.parse(attributes.url);
	const smoothScrollEnabled = JSON.parse(attributes.smoothscroll);
	const addResponsiveClasses = () => {
		parseJSON.responsiveSettings &&
			(parseJSON.mobileHidden &&
				splineContainer.current
					.closest(".akdev-spline-animation-block-wrapper")
					.classList.add("mobileHidden"),
			parseJSON.tabletHidden &&
				splineContainer.current
					.closest(".akdev-spline-animation-block-wrapper")
					.classList.add("tabletHidden"),
			parseJSON.desktopHidden &&
				splineContainer.current
					.closest(".akdev-spline-animation-block-wrapper")
					.classList.add("desktopHidden"));
	};
	function onLoad(spline) {
		splineProps.current = spline;
		gsap.set("main", { visibility: "visible" });
		// run fromTo animations
		parseJSON?.splineAnimations?.siw?.map((siwItem) => {
			siwItem.animations &&
				siwItem.animations
					.sort((a, b) => {
						if (a.animation.objectLayer < b.animation.objectLayer) {
							return -1;
						}
						if (a.animation.objectLayer > b.animation.objectLayer) {
							return 1;
						}
						return 0;
					})
					.forEach((animation, index) => {
						if (animation.type == "fromto") {
							const {
								animation: {
									animeLoop,
									animationProperies,
									objectLayer,
									propertyType,
									duration,
								},
							} = animation;
							const obj = spline.findObjectByName(objectLayer);
							cube.current = obj;
							const bikeRotate = gsap.timeline({
								defaults: {
									repeat: animeLoop ? -1 : 0,
									duration: duration ? duration : 1,
									yoyoEase: "power3.inOut",
								},
							});
							bikeRotate.fromTo(
								cube?.current?.[propertyType],
								animationProperies.from,
								animationProperies.to,
							);
						}
						if (animation.type == "normal") {
							if (siwItem.animations[index + 1]) {
								const {
									animation: {
										animationProperies: { position, rotation, scale },
									},
								} = siwItem.animations[index + 1];
								const obj = spline.findObjectByName(
									animation.animation.objectLayer,
								);
								cube.current = obj;
								const bikeWrapper = document.querySelector(siwItem.target);
								const currentStart = siwItem.animations[index].animeName;
								const nextAnimation = siwItem.animations[index + 1];

								const endValue = nextAnimation.animeName;
								const bikeRotate = gsap.timeline({
									scrollTrigger: {
										trigger: bikeWrapper,
										scrub: true,

										start: `${
											currentStart +
											`% ${siwItem.start ? siwItem.start : "bottom"}`
										}`,
										end: `${
											siwItem.start == "bottom"
												? endValue + "% bottom"
												: endValue + "%"
										}`,

										onEnter: (e) => {},
										onUpdate: (self) => {},
										onComplete: () => {
											// Your onComplete logic here
										},
									},
								});

								// Add your GSAP animations to the bikeRotate timeline
								// Example: bikeRotate.to(...);

								position &&
									siwItem.animations[index + 1].animation.objectLayer ==
										animation.animation.objectLayer &&
									Object.values(position).some((value) => value !== "") &&
									bikeRotate.to(
										obj?.position,
										{
											x:
												!isNaN(parseInt(position.x)) == true
													? position.x
													: obj?.position.x,
											y:
												!isNaN(parseInt(position.y)) == true
													? position.y
													: obj?.position.y,
											z:
												!isNaN(parseInt(position.z)) == true
													? position.z
													: obj?.position.z,
										},
										"<",
									);
								rotation &&
									siwItem.animations[index + 1].animation.objectLayer ==
										animation.animation.objectLayer &&
									Object.values(rotation).some((value) => value !== "") &&
									bikeRotate.to(
										obj?.rotation,
										{
											x:
												!isNaN(parseInt(rotation.x)) == true
													? rotation.x
													: obj?.rotation.x,
											y:
												!isNaN(parseInt(rotation.y)) == true
													? rotation.y
													: obj?.rotation.y,
											z:
												(!isNaN(parseInt(rotation.z)) == true) != ""
													? rotation.z
													: obj?.rotation.z,
											onComplete: () => {},
										},
										"<",
									);
								scale &&
									siwItem.animations[index + 1].animation.objectLayer ==
										animation.animation.objectLayer &&
									Object.values(scale).some((value) => value !== "") &&
									bikeRotate.to(
										obj?.scale,
										{
											x:
												!isNaN(parseInt(scale.x)) == true
													? scale.x
													: obj?.scale.x,
											y:
												!isNaN(parseInt(scale.y)) == true
													? scale.y
													: obj?.scale.y,
											z:
												!isNaN(parseInt(scale.z)) == true
													? scale.z
													: obj?.scale.z,
										},

										"<",
									);

								// Scroll into View
								if (animation.type == "siw") {
									const {
										animeBoundaries,
										scrollOutEnabled,
										animation: {
											animationProperies: { position, rotation, scale },
											scrollOut: { animationProperies },
											animeTimeline,
										},
									} = animation;
									const obj = spline.findObjectByName(
										animation.animation.objectLayer,
									);
									cube.current = obj;
									const siwAnime = gsap.timeline({
										defaults: { ease: "power1.inOut" },
										scrollTrigger: {
											trigger: animation.target,
											// markers: true,
											start: `${
												animeTimeline[0]?.start
													? animeTimeline[0]?.start + "%"
													: "top"
											} ${
												animeBoundaries?.start
													? animeBoundaries?.start
													: "bottom"
											}`,
											end: `${
												animeTimeline[1]?.end
													? animeTimeline[1].end + "%"
													: "bottom"
											} ${animeBoundaries?.end ? animeBoundaries?.end : "top"}`,

											onComplete: () => {},

											onLeaveBack: () => {
												scrollOutEnabled &&
													animationProperies.position &&
													siwAnime.to(
														obj?.position,
														{
															x:
																!isNaN(
																	parseInt(animationProperies.position.x),
																) == true
																	? animationProperies.position.x
																	: obj?.position.x,
															y:
																!isNaN(
																	parseInt(animationProperies.position.y),
																) == true
																	? animationProperies.position.y
																	: obj?.position.y,
															z:
																!isNaN(
																	parseInt(animationProperies.position.z),
																) == true
																	? animationProperies.position.z
																	: obj?.position.z,
														},
														">",
													);
												scrollOutEnabled &&
													animationProperies.rotation &&
													siwAnime.to(
														obj?.rotation,
														{
															x:
																!isNaN(
																	parseInt(animationProperies.rotation.x),
																) == true
																	? animationProperies.rotation.x
																	: obj?.rotation.x,
															y:
																!isNaN(
																	parseInt(animationProperies.rotation.y),
																) == true
																	? animationProperies.rotation.y
																	: obj?.rotation.y,
															z:
																!isNaN(
																	parseInt(animationProperies.rotation.z),
																) == true
																	? animationProperies.rotation.z
																	: obj?.rotation.z,

															onComplete: () => {},
														},
														">",
													);
												scrollOutEnabled &&
													animationProperies.scale &&
													siwAnime.to(
														obj?.scale,
														{
															x:
																!isNaN(parseInt(animationProperies.scale.x)) ==
																true
																	? animationProperies.scale.x
																	: obj?.scale.x,
															y:
																!isNaN(parseInt(animationProperies.scale.y)) ==
																true
																	? animationProperies.scale.y
																	: obj?.scale.y,
															z:
																!isNaN(parseInt(animationProperies.scale.z)) ==
																true
																	? animationProperies.scale.z
																	: obj?.scale.z,
														},
														">",
													);
											},

											onEnter: () => {
												position &&
													Object.values(position).some(
														(value) => value !== "",
													) &&
													siwAnime.to(
														obj?.position,
														{
															x:
																!isNaN(parseInt(position.x)) == true
																	? position.x
																	: obj?.position.x,
															y:
																!isNaN(parseInt(position.y)) == true
																	? position.y
																	: obj?.position.y,
															z:
																!isNaN(parseInt(position.z)) == true
																	? position.z
																	: obj?.position.z,
														},
														">",
													);
												rotation &&
													Object.values(rotation).some(
														(value) => value !== "",
													) &&
													siwAnime.to(
														obj?.rotation,
														{
															x:
																!isNaN(parseInt(rotation.x)) == true
																	? rotation.x
																	: obj?.rotation.x,
															y:
																!isNaN(parseInt(rotation.y)) == true
																	? rotation.y
																	: obj?.rotation.y,
															z:
																(!isNaN(parseInt(rotation.z)) == true) != ""
																	? rotation.z
																	: obj?.rotation.z,
															onComplete: () => {},
														},
														">",
													);
												scale &&
													Object.values(scale).some((value) => value !== "") &&
													siwAnime.to(
														obj?.scale,
														{
															x:
																!isNaN(parseInt(scale.x)) == true
																	? scale.x
																	: obj?.scale.x,
															y:
																!isNaN(parseInt(scale.y)) == true
																	? scale.y
																	: obj?.scale.y,
															z:
																!isNaN(parseInt(scale.z)) == true
																	? scale.z
																	: obj?.scale.z,
														},
														">",
													);
											},
										},
									});
								}
							}
						}
					});
		});
		if (smoothScrollEnabled) {
			const lenis = new Lenis({
				lerp: 0.1,
				infinite: false,
				gestureOrientation: "vertical",
				normalizeWheel: false,
				smoothTouch: false,
			});
			lenis.on("scroll", () => {
				ScrollTrigger.update();
			});

			gsap.ticker.add((time) => {
				lenis.raf(time * 1000);
			});

			gsap.ticker.lagSmoothing(0);
		}
	}
	useEffect(() => {
		// add responsive class
		addResponsiveClasses();
		// add responsive class
	}, []);
	return (
		<div
			className={`akdev-spline-animation`}
			style={{ width: "100%", height: "100%" }}
			ref={splineContainer}
		>
			<Spline
				style={{}}
				onLoad={onLoad}
				scene={
					parseJSON.splineUrl
						? parseJSON.splineUrl
						: "https://prod.spline.design/a8HDk7NyVYzsL0TP/scene.splinecode"
				}
			/>
		</div>
	);
}

window.addEventListener("DOMContentLoaded", (event) => {
	const wrappers = document.getElementsByClassName(
		`akdev-spline-animation-block-wrapper`,
	);
	for (let wrapper of wrappers) {
		render(
			<Client
				url={wrapper.getAttribute("data-attributes")}
				smoothscroll={wrapper.getAttribute("smooth-scroll")}
			/>,
			wrapper,
		);
	}
});
