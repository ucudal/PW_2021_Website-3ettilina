<script>
    import { onMount } from "svelte";
    import { getSkillsDetails } from "../../data/api/skills_api";
    import { skillsData } from "../../data/store/skills_store";
    import SkillsList from "../components/SkillsList.svelte";

    $: {
        onMount(async() => {
            getSkillsDetails()
        })
    }
</script>
<!--SKILLS AND HOBBIES-->
<section class="col-span-1 bg-pink-800 text-white divide-y-2 divide-white divide-dashed divide-opacity-60 container">
    <SkillsList skill={$skillsData.expertise} skillType='expertise' />
    <SkillsList skill={$skillsData.main} skillType='main' />
</section>