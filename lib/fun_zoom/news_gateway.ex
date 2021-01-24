defmodule FunZoom.NewsGateway do
  use GenServer

  @hours 60 * 60 * 1000
  @news_url "https://www.allsides.com/unbiased-balanced-news"

  def start_link(_args) do
    GenServer.start_link(__MODULE__, %{articles: []}, name: __MODULE__)
  end

  def get_articles() do
    GenServer.call(__MODULE__, :get_articles)
  end

  # Server (callbacks)

  @impl true
  def init(%{articles: []} = state) do
    schedule_refresh_articles()

    IO.puts("init - updating articles cache")
    {:ok, Map.put(state, :articles, fetch_articles())}
  end

  @impl true
  def handle_call(:get_articles, _from, %{articles: articles}) do
    IO.puts(":get_articles - fetching articles from cache...")
    {:reply, articles, %{ articles: articles }}
  end

  @impl true
  def handle_info(:refresh_articles, state) do
    IO.puts(":refresh_articles - updating articles...")

    updated_state = state
    |> Map.put(:articles, fetch_articles())

    schedule_refresh_articles()

    {:noreply, updated_state}
  end

  defp fetch_articles() do
    HTTPoison.get!(@news_url)
    |> Map.get(:body)
    |> FunZoom.AllsidesParser.get_articles()
  end

  defp schedule_refresh_articles() do
    IO.puts("schedule_refresh_articles - triggering article refresh")
    Process.send_after(self(), :refresh_articles, 1 * @hours)
  end
end