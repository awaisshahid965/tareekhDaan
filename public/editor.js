
let html = `
<div class="toolbar">
	<ul class="tool-list">
		<li class="tool">
			<button
				type="button"
				data-command='justifyLeft'
				class="tool--btn">
				<i class=' fas fa-align-left'></i>
			</button>
		</li>
		<li class="tool">
			<button
				type="button"
				data-command='justifyCenter'
				class="tool--btn">
				<i class=' fas fa-align-center'></i>
			</button>
		</li>
    <li class="tool">
			<button
				type="button"
				data-command='justifyFull'
				class="tool--btn">
				<i class=' fas fa-align-justify'></i>
			</button>
		</li>
    <li class="tool">
			<button
				type="button"
				data-command='justifyRight'
				class="tool--btn">
				<i class=' fas fa-align-right'></i>
			</button>
		</li>
    <li class="tool">
			<button
				type="button"
				data-command='strikeThrough'
				class="tool--btn">
				<i class=' fas fa-strikethrough'></i>
			</button>
		</li>
    <li class="tool">
			<button
				type="button"
				data-command="underline"
				class="tool--btn">
				<i class=' fas fa-underline'></i>
			</button>
		</li>
		<li class="tool">
			<button
				type="button"
				data-command="bold"
				class="tool--btn">
				<i class=' fas fa-bold'></i>
			</button>
		</li>
		<li class="tool">
			<button
				type="button"
				data-command="italic"
				class="tool--btn">
				<i class=' fas fa-italic'></i>
			</button>
		</li>
		<li class="tool">
			<button
				type="button"
				data-command="createlink"
				class="tool--btn">
				<i class=' fas fa-link'></i>
			</button>
		</li>
    <li class="tool">
			<button
				type="button"
				data-command="unlink"
				class="tool--btn">
				<i class=' fas fa-unlink'></i>
			</button>
		</li>
	</ul>
</div>
`;

document.querySelector('#editorjs').insertAdjacentHTML('beforeend', html);


let output = document.getElementById('output');
let buttons = document.getElementsByClassName('tool--btn');
for (let btn of buttons) {
	btn.addEventListener('click', () => {
		let cmd = btn.dataset['command'];
		if(cmd === 'createlink') {
			let url = prompt("Enter the link here: ", "http:\/\/");
			document.execCommand(cmd, false, url);
		} else {
			document.execCommand(cmd, false, null);
		}
	})
}


document.querySelector('.edit_cat form').addEventListener('submit', e => {
	e.preventDefault();
	document.querySelector('textarea').value = document.querySelector('#output').innerHTML;
	document.querySelector('.edit_cat form').submit();
});

console.log(isUrdu);

if (isUrdu) {
	output.style.direction = 'rtl';
	output.style.textAlign = 'right';
}
