<script>
    export let id
    export let className
    export let onClick
</script>
<button id={id} class={className} type="button" on:click={onClick}>
    <slot></slot>
</button>