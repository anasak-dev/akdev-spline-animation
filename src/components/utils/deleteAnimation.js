const deleteAnimation = (id, splineAnimations, setAttributes, animations) => {
	setAttributes({
		animations: animations.filter((item) => item.id !== id),
	});
	const newSiwAnimations = splineAnimations.siw.map((siwItem) => {
		// Check if the siwItem has the same id as the one you want to update
		return {
			...siwItem,
			animations: siwItem.animations.filter((item) => item.id !== id),
		};
	});
	setAttributes({
		splineAnimations: {
			siw: newSiwAnimations,
		},
	});
};

export default deleteAnimation;
