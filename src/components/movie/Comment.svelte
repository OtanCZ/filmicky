<script lang="ts">
	import { enhance } from '$app/forms';

	let { comment, user } = $props();

	let showReplyBox = $state(false);

	const stars = Array.from({ length: 10 }, (_, i) => ({
		starValue: i + 1,
		maskClass: i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'
	}));

	// fallback avatar if none is available
	const getAvatar = (user) => {
		return user.images?.image_uri || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user.username;
	}
</script>

<div class="card bg-black/20 shadow-sm p-4 my-3 rounded-xl">
	<div class="flex flex-col gap-3">

		<!-- Comment header -->
		<div class="flex items-center gap-3">
			<img src={comment.users? getAvatar(comment.users) : 'https://api.dicebear.com/7.x/identicon/svg?seed=' + crypto.randomUUID()} alt="User avatar" class="w-10 h-10 rounded-full object-cover border border-gray-400" />

			<div class="flex flex-col">
				{#if comment.users}
					<p class="font-semibold text-gray-200"><a class="link link-primary" href={"/profiles/" + comment.users.id}>{comment.users.username}</a></p>
				{:else }
					<p class="font-semibold text-gray-200">Smazaný uživatel</p>
				{/if}
				<span class="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
			</div>

			<div class="ml-auto rating rating-half">
				{#each stars as { starValue, maskClass } (starValue)}
					<div
						class="mask mask-star-2 {maskClass}"
						aria-label="{starValue} star"
						aria-current={comment.ratings.rating === starValue}
					></div>
				{/each}
			</div>
		</div>

		<!-- Comment text -->
		<p class="text-gray-300">{comment.comment}</p>

		<!-- Actions -->
		<div class="flex items-center gap-2 text-sm text-gray-400">
			{#if user !== null}
				<button onclick={() => showReplyBox = !showReplyBox} class="link link-primary">Odpovědět</button>

				{#if (comment.users && comment.users.id === user.id) || user.user_permissions_id >= 2}
					<form method="POST" action="?/deleteComment" use:enhance class="ml-auto">
						<input type="hidden" name="commentId" value={comment.id} />
						<button type="submit" class="btn btn-sm btn-error">Smazat</button>
					</form>
				{/if}
			{/if}
		</div>

		<!-- Reply box -->
		{#if showReplyBox}
			<form
				method="POST"
				action="?/commentReply"
				id="comment-reply"
				use:enhance
				class="mt-2 flex flex-col gap-2"
			>
				<input type="hidden" name="parentCommentId" value={comment.id} />
				<textarea
					name="replyContent"
					class="textarea textarea-bordered w-full"
					placeholder="Vaše odpověď..."
					required
				></textarea>
				<button type="submit" class="btn btn-secondary btn-sm w-full">
					Odeslat odpověď
				</button>
			</form>
		{/if}

		<!-- Replies -->
		{#each comment.other_comments as reply (reply.id)}
			<div class="flex flex-col ml-10 mt-4 gap-2 border-l-2 border-gray-600 pl-4">

				<div class="flex items-center gap-3">
					<img src={reply.users? getAvatar(reply.users) : 'https://api.dicebear.com/7.x/identicon/svg?seed=' + crypto.randomUUID()} alt="User avatar" class="w-8 h-8 rounded-full object-cover border border-gray-400" />

					<div class="flex flex-col">
						{#if reply.users}
							<p class="font-semibold text-gray-200"><a class="link link-primary" href={"/profiles/" + reply.users.id}>{reply.users.username}</a></p>
						{:else }
							<p class="font-semibold text-gray-200">Smazaný uživatel</p>
						{/if}
						<span class="text-xs text-gray-400">{new Date(reply.created_at).toLocaleString()}</span>
					</div>
				</div>

				<p class="text-gray-300">{reply.comment}</p>

				{#if user !== null}
					{#if reply.users.id === user.id || user.user_permissions_id >= 2}
						<form method="POST" action="?/deleteComment" use:enhance>
							<input type="hidden" name="commentId" value={reply.id} />
							<button type="submit" class="btn btn-sm btn-error">
								Smazat
							</button>
						</form>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>
