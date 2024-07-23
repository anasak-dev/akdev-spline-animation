const addAnimationItem = (
	attributes,
	setAttributes,
	animation,
	scrolledValue,
	splineAnimations,
) => {
	const newSiwAnimations = attributes.splineAnimations.siw.map((siwItem) => {
		// Check if the siwItem has the same id as the one you want to update
		if (siwItem.id === animation.id) {
			// Add the new JSON object to the animations array
			return {
				...siwItem,
				animations: [
					...siwItem.animations,
					{
						animeName: scrolledValue.value,
						type: "normal",
						id: Math.random() * 10 + 1 + splineAnimations.siw.length + 1,
						animation: {
							animationProperies: "",
							animeLoop: "",
							animeTimeline: [
								{
									start: scrolledValue.value,
								},
							],
							objectLayer: "",
							item: "",
							property: "",
							propertyType: "",
						},
						animeBoundaries: "",
					},
				],
			};
		}
		return siwItem;
	});
	setAttributes({
		splineAnimations: {
			siw: newSiwAnimations,
		},
	});
};

export default addAnimationItem;
