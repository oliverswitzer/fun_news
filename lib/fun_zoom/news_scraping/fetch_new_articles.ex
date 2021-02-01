defmodule FunZoom.NewsScraping.FetchNewArticles do
  use Oban.Worker, queue: :default

  @all_news_api Application.compile_env(:fun_zoom, :all_news_api)

  @impl Oban.Worker
  def perform(_args) do
    # TODO: This test passes but:
    # TODO   the function "top_stories" is incorrect... it should really be returning something like categories rather than articles
    # TODO   because each top story has multiple articles... maybe top_stories should be renamed to trending_categories, or something.
    # TODO   Once we have categories, we can fetch and save all the articles on each categories page.
    # TODO   For each of those articles, we can fetch the original source article.
    # has many articles...
    categories = @all_news_api.top_stories()

    articles
    |> Enum.each(fn category ->
      %{category_url: category.link}
      |> FunZoom.NewsScraping.FetchArticlesForCategory.new()
      |> Oban.insert()
    end)

    :ok
  end
end