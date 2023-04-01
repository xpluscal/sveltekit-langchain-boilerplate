<script lang="ts">
    import { enhance } from "$app/forms";
    let loading = false;
    let summary = "";
    let error = false;
</script>

<style>
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    margin-top: 2rem;
  }
</style>

<div class="form-container">

  <h1>PDF Summarizer</h1>

  <form action="?/summarize" method="post" use:enhance={({ form, data, action, cancel, submitter }) => {
    loading = true;
    return async ({ result, update }) => {
      if(result.status === 200){
        summary = result.data.summary;
      } else {
        error = true;
      }
      loading = false;
    };
  }}>
    <input type="file" name="file" accept=".pdf">
    <button  aria-busy={loading} type="submit">{loading ? "Please Wait..." : "Summarize"}</button>
  </form>

  {#if summary !== "" && !loading}

    <article>
      <h2>Summary</h2>
      <p>{summary}</p>
    </article>

  {/if}

  {#if error}
    <p>There was an error processing your request. Please try again.</p>
  {/if}
</div>