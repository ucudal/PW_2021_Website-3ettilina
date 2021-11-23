<script>
    import { getExperienceDetails } from "../../data/api/experience_api"
    import ExperienceContainer from "../components/ExperienceContainer.svelte"
    import { jobDetails, studyDetails } from "../../data/store/exp_details_store";
    import { onMount } from "svelte";

    $: {
        onMount(async() => {
            console.log("Fetching experience")
            getExperienceDetails()
        })
    }
</script>
<!--EXPERIENCE && EDUCATION-->
{#if jobDetails}
<section class="col-span-2 grid grid-cols-2 gap-2 bg-white shadow-2xl pt-10">
    <article class="col-span-1 p-5">
        <h1 class="text-xl mb-6 font-semibold">PROFESSIONAL EXPERIENCE 👩🏻‍💻</h1>
        <div>
            {#each $jobDetails as job}
                <ExperienceContainer details={job} type='job' />
            {/each}
        </div>
    </article>
    <article class="col-span-1 p-5">
        <h1 class="text-xl mb-6 font-semibold">EDUCATION 👩🏻‍🎓</h1>
        <div>
            {#each $studyDetails as study}
                <ExperienceContainer details={study} type='study' />
            {/each}
        </div>
    </article>
</section>
{/if}