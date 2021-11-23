<script>
    export let name = ''
    export let title = ''
    export let placeholder = ''
    export let value
    export let required = false
    export let errorMessage = ''
    export let type = 'text'

    const handleInput = e => {
        e.target.type = type
        value = e.target.value
    }
</script>
<div class="flex flex-col mb-4">
    <label for={name}
           class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
        {title}
    </label>

    <div class="relative">
        <div class="absolute flex border border-transparent left-0 top-0 h-full w-10">
            <div class="flex items-center justify-center rounded-tl rounded-bl z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
                <slot></slot>
            </div>
        </div>

        <input id={name}
               name={name}
               type={type}
               placeholder={placeholder}
               value={value}
               on:input={handleInput}
               class="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12">
    </div>
    {#if required}
        <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
            {errorMessage}
        </span>
    {/if}
</div>