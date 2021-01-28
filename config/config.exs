# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :fun_zoom,
  ecto_repos: [FunZoom.Repo]

config :fun_zoom, Oban,
  repo: FunZoom.Repo,
  plugins: [Oban.Plugins.Pruner],
  queues: [default: 10]

# Configures the endpoint
config :fun_zoom, FunZoomWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "b9AOXrJgQVaxvQzlUjukdtzmmIsvGOqJS4J8H6pnOqmuYc9gg+hVoV5ZvUo2H942",
  render_errors: [view: FunZoomWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: FunZoom.PubSub,
  live_view: [signing_salt: "XANapLLk"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :fun_zoom, :all_news_api, FunZoom.Test.MockAllNewsApi