let cards = document.querySelectorAll(`.card`);
let delivery = document.querySelector(`.delivery`);

for(let i = 0; i < cards.length; i++)
{
	let card = cards[i];
	card.addEventListener(`click`, function()
	{
		let food = document.querySelectorAll(`.num`)[i];
		food.innerHTML = Number(food.innerHTML) + 1;
	});
}

delivery.addEventListener(`click`, function()
{
	for(let i = 0; i < cards.length; i++)
	{
		let food = document.querySelectorAll(`.num`)[i];
		food.innerHTML = `0`;
	}
});