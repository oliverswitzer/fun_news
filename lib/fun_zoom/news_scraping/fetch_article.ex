defmodule FunZoom.NewsScraping.FetchArticle do
  use Oban.Worker, queue: :default

  @impl Oban.Worker
  def perform(_args) do

  end
end