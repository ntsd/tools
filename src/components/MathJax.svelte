<script lang="ts">
	import { mathjax } from 'mathjax-full/js/mathjax';
	import { TeX } from 'mathjax-full/js/input/tex';
	import { SVG } from 'mathjax-full/js/output/svg';
	import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
	import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
	import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

	const adaptor = liteAdaptor();
	RegisterHTMLHandler(adaptor);

	const mathjax_document = mathjax.document('', {
		InputJax: new TeX({ packages: AllPackages }),
		OutputJax: new SVG({ fontCache: 'local' })
	});

	const mathjax_options = {
		em: 16,
		ex: 8,
		containerWidth: 1280
	};

	export function get_mathjax_svg(math: string): string {
		const node = mathjax_document.convert(math, mathjax_options);
		return adaptor.innerHTML(node);
	}

	console.log(
		get_mathjax_svg(
			'left( sum_{k=1}^n a_k b_k \right)^2 leq left( sum_{k=1}^n a_k^2 \right) left( sum_{k=1}^n b_k^2 \right)'
		)
	);
</script>

{@html get_mathjax_svg(
	`\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)`
)}
