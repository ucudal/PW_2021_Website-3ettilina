<script lang="ts">
    import ContactForm from "../docs/ui/components/ContactForm.svelte";
    import Container from "../docs/ui/components/Container.svelte";
    import Experience from "../docs/ui/sections/Experience.svelte";
    import Profile from '../docs/ui/sections/Profile.svelte';
    import Skills from "../docs/ui/sections/Skills.svelte";

    let showContactModal = false

    function showModal() {
        showContactModal = true
    }

    function closeModal() {
        showContactModal = false
    }
</script>
<main class="antialiased bg-gray-200">
    <Container>
        <Profile onContactClick={() => showModal()}/>
        <Experience />
        <Skills />
    </Container>
    <ContactForm show={showContactModal} handleClose={() => closeModal()}/>
</main>