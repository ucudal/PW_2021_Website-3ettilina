<script>
    export let details
    export let type
    let style

    $: { 
        if (type == 'job') {
            style = details.current ? 'mb-5 p-4 rounded-md shadow-xl bg-green-50' : 'mb-5 p-4 rounded-md shadow-xl bg-indigo-50'
        } else {
            style = details.completed ? 'mb-5 p-4 rounded-md shadow-xl bg-green-50' : 'mb-5 p-4 rounded-md shadow-xl bg-pink-50'
        }
    }
</script>
<article class={style}>
    <p class="text-s font-light italic">{details.date}</p>
    <h2 class="text-m font-semibold">{details.title}</h2>
    <h3 class="text-blue-500 mb-2"><a href={details.place.webpage}>{details.place.name}</a></h3>
    {#each details.description as desc}
    <p class="text-s font-light">{desc}</p>
    {/each}
    {#if details.place.certificate}
    <p class="text-s italic text-blue-600"><a href={details.place.certificate} target="_blank">View certification</a></p>
    {/if}
</article>