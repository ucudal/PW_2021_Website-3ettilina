<script>
    export let details
    export let type
    let style

    $: { 
        if (type == 'job') {
            style = details.actual ? 'mb-5 p-4 rounded-md shadow-xl bg-green-50' : 'mb-5 p-4 rounded-md shadow-xl bg-indigo-50'
        } else {
            style = details.completado ? 'mb-5 p-4 rounded-md shadow-xl bg-green-50' : 'mb-5 p-4 rounded-md shadow-xl bg-pink-50'
        }
    }
</script>
<article class={style}>
    <p class="text-s font-light italic">{details.fechaInicio} - {details.fechaFin}</p>
    <h2 class="text-m font-semibold">{type == 'job' ? details.puesto : details.titulo}</h2>
    <h3 class="text-blue-500 mb-2"><a href={type == 'job' ? details.empresa.web : details.instituto.web}>{type == 'job' ? details.empresa.nombre : details.instituto.nombre}</a></h3>
    {#each details.descripcion as desc}
    <p class="text-s font-light">{desc}</p>
    {/each}
    {#if details.instituto != undefined && details.instituto.certificado}
    <p class="text-s italic text-blue-600"><a href={details.instituto.certificado} target="_blank">View certification</a></p>
    {/if}
</article>