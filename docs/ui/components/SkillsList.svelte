<script>
    export let skill
    export let skillType

    let skillIcon

    $:{
        skillIcon = (skillType == 'expertise') ? '⭐️' : '✅'
    }

</script>
<article class="pt-10 pb-5">
    <h1 class="text-xl font-semibold mb-5">{skill.title}</h1>
    <div class="mb-5 pl-7 pr-7 grid gap-2">
        {#each skill.list as skillName}
            <p>{skillIcon}  {skillName}</p>
        {/each}
    </div>
</article>