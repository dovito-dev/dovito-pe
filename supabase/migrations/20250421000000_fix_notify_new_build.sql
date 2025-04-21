
CREATE OR REPLACE FUNCTION public.notify_new_build()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'id', new.id,
    'created_at', new.created_at,
    'user_id', new.user_id,
    'request', new.request  -- Changed from 'input' to 'request'
  );

  -- Send async HTTP POST request
  perform net.http_post(
    url := 'https://n8n.dovito.com/webhook-test/prompt-engineer',
    headers := '{"Content-Type": "application/json"}',
    body := payload::text
  );

  return new;
end;
$function$;
