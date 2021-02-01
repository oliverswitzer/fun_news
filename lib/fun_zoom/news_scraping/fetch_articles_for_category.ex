defmodule FunZoom.NewsScraping.FetchArticlesForCategory do
  use Oban.Worker, queue: :default

  @all_news_api Application.compile_env(:fun_zoom, :all_news_api)

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"category_url" => url} = args}) do

  end
end